"""Safely migrate published CMS product images to responsive WebP variants.

The script always writes a JSON backup before the first database update. It
uploads versioned objects first, updates one complete product at a time, and
never deletes legacy objects. Run without --apply for a read-only inventory.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from PIL import Image, ImageOps


BUCKET = "cms-media"
CACHE_SECONDS = "31536000"
THUMB_MAX_DIMENSION = 800
THUMB_TARGET_BYTES = 180 * 1024
LARGE_MAX_DIMENSION = 2000
LARGE_TARGET_BYTES = 600 * 1024
SUPABASE_PUBLIC_MARKER = f"/storage/v1/object/public/{BUCKET}/"


def request_json(
    url: str,
    key: str,
    method: str = "GET",
    payload: Any | None = None,
    extra_headers: dict[str, str] | None = None,
) -> Any:
    body = None if payload is None else json.dumps(payload).encode("utf-8")
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        **(extra_headers or {}),
    }
    if body is not None:
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(
        url, data=body, headers=headers, method=method
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        raw = response.read()
        return json.loads(raw) if raw else None


def download(url: str) -> bytes:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "AushenMediaMigration/2.0"},
        method="GET",
    )
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read()


def encode_variant(
    original: Image.Image,
    max_dimension: int,
    target_bytes: int,
) -> tuple[bytes, int, int]:
    smallest: tuple[bytes, int, int] | None = None
    for scale_step in (1.0, 0.88, 0.76, 0.66):
        dimension = round(max_dimension * scale_step)
        image = original.copy()
        image.thumbnail((dimension, dimension), Image.Resampling.LANCZOS)
        for quality in (82, 76, 70, 64, 58, 52, 46):
            output = io.BytesIO()
            image.save(
                output,
                "WEBP",
                quality=quality,
                method=5,
                icc_profile=original.info.get("icc_profile"),
                exif=b"",
            )
            encoded = output.getvalue()
            candidate = (encoded, image.width, image.height)
            if smallest is None or len(encoded) < len(smallest[0]):
                smallest = candidate
            if len(encoded) <= target_bytes:
                return candidate
    if smallest is None:
        raise RuntimeError("image encoder did not produce a variant")
    return smallest


def prepare_variants(raw: bytes) -> dict[str, Any]:
    content_hash = hashlib.sha256(raw).hexdigest()
    with Image.open(io.BytesIO(raw)) as source:
        image = ImageOps.exif_transpose(source)
        has_alpha = "A" in image.getbands()
        image = image.convert("RGBA" if has_alpha else "RGB")
        thumbnail, thumb_width, thumb_height = encode_variant(
            image, THUMB_MAX_DIMENSION, THUMB_TARGET_BYTES
        )
        large, large_width, large_height = encode_variant(
            image, LARGE_MAX_DIMENSION, LARGE_TARGET_BYTES
        )
    return {
        "contentHash": content_hash,
        "thumbnail": {
            "bytes": thumbnail,
            "width": thumb_width,
            "height": thumb_height,
        },
        "large": {
            "bytes": large,
            "width": large_width,
            "height": large_height,
        },
    }


def upload_object(
    supabase_url: str,
    key: str,
    path: str,
    body: bytes,
) -> None:
    encoded_path = urllib.parse.quote(path, safe="/")
    url = f"{supabase_url}/storage/v1/object/{BUCKET}/{encoded_path}"
    request = urllib.request.Request(
        url,
        data=body,
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "image/webp",
            # Supabase's raw Storage API expects the numeric cache duration.
            # The public response is emitted as `max-age=<seconds>`.
            "cache-control": CACHE_SECONDS,
            "x-upsert": "false",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=90):
            return
    except urllib.error.HTTPError as error:
        message = error.read().decode("utf-8", errors="replace")
        if error.code in (400, 409) and (
            "Duplicate" in message or "already exists" in message
        ):
            return
        raise RuntimeError(f"upload failed ({error.code}): {message}") from error


def public_url(supabase_url: str, path: str) -> str:
    encoded_path = urllib.parse.quote(path, safe="/")
    return (
        f"{supabase_url}/storage/v1/object/public/{BUCKET}/{encoded_path}"
    )


def migrate_url(
    url: str,
    supabase_url: str,
    key: str,
    apply: bool,
    cache: dict[str, dict[str, Any]],
) -> dict[str, Any] | None:
    if not url.startswith("http") or SUPABASE_PUBLIC_MARKER not in url:
        return None
    if url in cache:
        return cache[url]

    raw = download(url)
    prepared = prepare_variants(raw)
    content_hash = prepared["contentHash"]
    base_path = f"products/optimized-v3/{content_hash}"
    thumb_path = f"{base_path}-thumb-v3.webp"
    large_path = f"{base_path}-large-v3.webp"
    if apply:
        upload_object(
            supabase_url,
            key,
            thumb_path,
            prepared["thumbnail"]["bytes"],
        )
        upload_object(
            supabase_url,
            key,
            large_path,
            prepared["large"]["bytes"],
        )
    result = {
        "thumbnail": {
            "url": public_url(supabase_url, thumb_path),
            "width": prepared["thumbnail"]["width"],
            "height": prepared["thumbnail"]["height"],
            "sizeBytes": len(prepared["thumbnail"]["bytes"]),
            "mimeType": "image/webp",
            "contentHash": content_hash,
        },
        "large": {
            "url": public_url(supabase_url, large_path),
            "width": prepared["large"]["width"],
            "height": prepared["large"]["height"],
            "sizeBytes": len(prepared["large"]["bytes"]),
            "mimeType": "image/webp",
            "contentHash": content_hash,
        },
        "legacyUrl": url,
        "legacySizeBytes": len(raw),
    }
    cache[url] = result
    return result


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--product", action="append", default=[])
    parser.add_argument("--exclude-product", action="append", default=[])
    parser.add_argument("--backup-dir", required=True)
    args = parser.parse_args()

    supabase_url = (
        os.environ.get("SUPABASE_URL")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
        or ""
    ).rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or ""
    if not supabase_url or not key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required"
        )

    products_url = (
        f"{supabase_url}/rest/v1/cms_products"
        "?status=eq.published&select=*&order=slug.asc"
    )
    rows = request_json(products_url, key)
    if args.product:
        requested = set(args.product)
        rows = [row for row in rows if row.get("slug") in requested]
    if args.exclude_product:
        excluded = set(args.exclude_product)
        rows = [row for row in rows if row.get("slug") not in excluded]

    backup_dir = Path(args.backup_dir)
    backup_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup_path = backup_dir / f"cms-product-media-before-{stamp}.json"
    backup_path.write_text(
        json.dumps(
            {
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "projectUrl": supabase_url,
                "apply": args.apply,
                "rows": rows,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Backup: {backup_path}")

    migrated_cache: dict[str, dict[str, Any]] = {}
    report: list[dict[str, Any]] = []
    total_before = 0
    total_after = 0

    for index, row in enumerate(rows, start=1):
        slug = row["slug"]
        content = row.get("content") or {}
        legacy_product_url = row.get("image_url")
        legacy_application_urls = [
            url
            for url in content.get("applicationImageUrls", [])
            if isinstance(url, str)
        ]
        try:
            product_asset = migrate_url(
                legacy_product_url,
                supabase_url,
                key,
                args.apply,
                migrated_cache,
            )
            application_assets = [
                migrate_url(
                    url,
                    supabase_url,
                    key,
                    args.apply,
                    migrated_cache,
                )
                for url in legacy_application_urls
            ]
            next_application_urls = [
                asset["large"]["url"] if asset else url
                for asset, url in zip(
                    application_assets, legacy_application_urls, strict=True
                )
            ]
            next_media_assets = {
                "product": (
                    {
                        "thumbnail": product_asset["thumbnail"],
                        "large": product_asset["large"],
                    }
                    if product_asset
                    else content.get("mediaAssets", {}).get("product")
                ),
                "applications": [
                    {
                        "thumbnail": asset["thumbnail"],
                        "large": asset["large"],
                    }
                    if asset
                    else {
                        "thumbnail": {
                            "url": url,
                            "width": 0,
                            "height": 0,
                            "sizeBytes": 0,
                            "mimeType": "",
                            "contentHash": "",
                        },
                        "large": {
                            "url": url,
                            "width": 0,
                            "height": 0,
                            "sizeBytes": 0,
                            "mimeType": "",
                            "contentHash": "",
                        },
                    }
                    for asset, url in zip(
                        application_assets,
                        legacy_application_urls,
                        strict=True,
                    )
                ],
            }
            next_content = {
                **content,
                "applicationImageUrls": next_application_urls,
                "mediaAssets": next_media_assets,
            }
            next_image_url = (
                product_asset["large"]["url"]
                if product_asset
                else legacy_product_url
            )

            before = sum(
                asset["legacySizeBytes"]
                for asset in [product_asset, *application_assets]
                if asset
            )
            after = sum(
                asset["thumbnail"]["sizeBytes"] + asset["large"]["sizeBytes"]
                for asset in [product_asset, *application_assets]
                if asset
            )
            if args.apply:
                row_url = (
                    f"{supabase_url}/rest/v1/cms_products"
                    f"?id=eq.{urllib.parse.quote(str(row['id']))}"
                )
                request_json(
                    row_url,
                    key,
                    method="PATCH",
                    payload={
                        "image_url": next_image_url,
                        "content": next_content,
                    },
                    extra_headers={"Prefer": "return=minimal"},
                )
            total_before += before
            total_after += after
            report.append(
                {
                    "slug": slug,
                    "status": "migrated" if args.apply else "planned",
                    "beforeBytes": before,
                    "afterBytes": after,
                }
            )
            print(
                f"[{index}/{len(rows)}] {slug}: "
                f"{before / 1024 / 1024:.2f} MB -> "
                f"{after / 1024 / 1024:.2f} MB"
            )
        except Exception as error:
            report.append(
                {"slug": slug, "status": "failed", "error": str(error)}
            )
            print(f"[{index}/{len(rows)}] {slug}: FAILED: {error}")
        time.sleep(0.05)

    report_path = backup_dir / f"cms-product-media-report-{stamp}.json"
    report_path.write_text(
        json.dumps(
            {
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "apply": args.apply,
                "totalBeforeBytes": total_before,
                "totalAfterBytes": total_after,
                "products": report,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    failed = [item for item in report if item["status"] == "failed"]
    print(f"Report: {report_path}")
    print(
        f"Total: {total_before / 1024 / 1024:.2f} MB -> "
        f"{total_after / 1024 / 1024:.2f} MB; failures: {len(failed)}"
    )
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
