"""Restore CMS product media fields from a migration backup.

Dry-run is the default. Pass --apply only after reviewing the listed products.
This restores database references; optimized and legacy Storage objects remain.
"""

from __future__ import annotations

import argparse
import json
import os
import urllib.parse
import urllib.request
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("backup")
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    backup = json.loads(Path(args.backup).read_text(encoding="utf-8"))
    supabase_url = (
        os.environ.get("SUPABASE_URL")
        or os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
        or backup.get("projectUrl", "")
    ).rstrip("/")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or ""
    if not supabase_url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")

    rows = backup.get("rows", [])
    print(f"{'Restoring' if args.apply else 'Would restore'} {len(rows)} products")
    for index, row in enumerate(rows, start=1):
        print(f"[{index}/{len(rows)}] {row['slug']}")
        if not args.apply:
            continue
        url = (
            f"{supabase_url}/rest/v1/cms_products"
            f"?id=eq.{urllib.parse.quote(str(row['id']))}"
        )
        body = json.dumps(
            {"image_url": row.get("image_url"), "content": row.get("content")}
        ).encode("utf-8")
        request = urllib.request.Request(
            url,
            data=body,
            method="PATCH",
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal",
            },
        )
        with urllib.request.urlopen(request, timeout=60):
            pass
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
