#!/usr/bin/env python3
"""Build blog data from a WordPress XML export."""

from __future__ import annotations

import argparse
import html
import json
import math
import re
from collections import Counter
from dataclasses import dataclass
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable
import xml.etree.ElementTree as ET


NS = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
    "wp": "http://wordpress.org/export/1.2/",
}

REPO_DEFAULT_SOURCE = "docs/aushenstone.wordpress.xml"
DOWNLOADS_FALLBACK = "~/Downloads/aushenstone.WordPress.2026-03-12 (1).xml"
DEFAULT_OUTPUT = "src/data/blog.generated.ts"
GENERIC_CATEGORY_SLUGS = {"stone"}
ALLOWED_BLOCK_TAGS = {"blockquote", "h2", "h3", "h4", "li", "ol", "p", "ul"}
ALLOWED_INLINE_TAGS = {"a", "b", "br", "em", "i", "strong"}
BLOCK_BREAK_TAGS = {"article", "div", "section"}


@dataclass(frozen=True)
class BlogCategoryRef:
    name: str
    slug: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate blog data from WordPress XML.")
    parser.add_argument(
        "--source",
        type=Path,
        default=None,
        help="Path to the WordPress XML export. If omitted, known fallback paths are tried.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Path to the generated TypeScript file.",
    )
    return parser.parse_args()


def resolve_source_path(provided: Path | None, project_root: Path) -> Path:
    candidates: list[Path] = []
    if provided:
        candidates.append(provided.expanduser())
    candidates.extend(
        [
            project_root / REPO_DEFAULT_SOURCE,
            Path(DOWNLOADS_FALLBACK).expanduser(),
        ]
    )

    for candidate in candidates:
        if candidate.exists():
            return candidate

    joined = "\n".join(f"- {candidate}" for candidate in candidates)
    raise FileNotFoundError(
        "No WordPress XML export found. Checked:\n" + joined
    )


def slugify(value: str) -> str:
    return (
        value.strip()
        .lower()
        .replace("&", "and")
        .replace("’", "")
        .replace("'", "")
        .replace("/", "-")
        .replace(":", "")
    )


def normalize_slug(value: str) -> str:
    return re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9]+", "-", slugify(value))).strip("-")


def strip_tags(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", value)).strip()


def normalize_attachment_url(value: str) -> str:
    if value.startswith("http://"):
        return "https://" + value[len("http://") :]
    return value


def truncate_text(value: str, limit: int = 180) -> str:
    if len(value) <= limit:
        return value

    truncated = value[: limit + 1].rsplit(" ", 1)[0].strip()
    if not truncated:
        truncated = value[:limit].strip()

    return truncated.rstrip(".,;:!?") + "..."


def preprocess_content(raw: str) -> str:
    cleaned = raw.replace("\r", "")
    cleaned = re.sub(r"<!--.*?-->", "", cleaned, flags=re.S)

    def replace_custom_heading(match: re.Match[str]) -> str:
        text = html.unescape(match.group(1) or "").strip()
        return f"<h2>{text}</h2>" if text else ""

    cleaned = re.sub(
        r'\[vc_custom_heading[^\]]*?text="([^"]+)"[^\]]*\]',
        replace_custom_heading,
        cleaned,
    )

    def replace_text_separator(match: re.Match[str]) -> str:
        text = html.unescape(match.group(1) or "").strip()
        return f"<h2>{text}</h2>" if text else ""

    cleaned = re.sub(
        r'\[vc_text_separator[^\]]*?title="([^"]+)"[^\]]*\]',
        replace_text_separator,
        cleaned,
    )

    patterns = [
        r"\[/?vc_row[^\]]*\]",
        r"\[/?vc_row_inner[^\]]*\]",
        r"\[/?vc_column_text[^\]]*\]",
        r"\[/?vc_column_inner[^\]]*\]",
        r"\[/?vc_column[^\]]*\]",
        r"\[vc_(?:single_image|btn|media_grid|gallery)[^\]]*\]",
        r"\[/vc_[^\]]+\]",
    ]
    for pattern in patterns:
        cleaned = re.sub(pattern, "\n\n", cleaned)

    cleaned = re.sub(r"</?span[^>]*>", "", cleaned)
    cleaned = cleaned.replace("&nbsp;", " ")
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned


class HtmlCleaner(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.output: list[str] = []
        self.stack: list[str] = []
        self.auto_paragraph_open = False

    def _close_auto_paragraph(self) -> None:
        if not self.auto_paragraph_open:
            return

        self.output.append("</p>")
        self.auto_paragraph_open = False
        if self.stack and self.stack[-1] == "p":
            self.stack.pop()

    def _ensure_paragraph(self) -> None:
        if self.stack:
            return

        self.output.append("<p>")
        self.stack.append("p")
        self.auto_paragraph_open = True

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in BLOCK_BREAK_TAGS:
            self._close_auto_paragraph()
            return

        if tag in ALLOWED_BLOCK_TAGS:
            self._close_auto_paragraph()
            self.output.append(f"<{tag}>")
            self.stack.append(tag)
            return

        if tag not in ALLOWED_INLINE_TAGS:
            return

        if tag != "br" and not self.stack:
            self._ensure_paragraph()

        if tag == "a":
            href = ""
            for key, value in attrs:
                if key == "href" and value:
                    href = value.strip()
                    break

            if not href:
                return

            self.output.append(f'<a href="{html.escape(href, quote=True)}">')
            self.stack.append("a")
            return

        self.output.append(f"<{tag}>")
        if tag != "br":
            self.stack.append(tag)

    def handle_endtag(self, tag: str) -> None:
        if tag in BLOCK_BREAK_TAGS:
            self._close_auto_paragraph()
            return

        if tag == "p" and self.auto_paragraph_open:
            self._close_auto_paragraph()
            return

        if tag == "br" or tag not in ALLOWED_BLOCK_TAGS.union(ALLOWED_INLINE_TAGS):
            return

        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index] != tag:
                continue

            while len(self.stack) > index:
                current = self.stack.pop()
                self.output.append(f"</{current}>")

            if tag == "p":
                self.auto_paragraph_open = False
            break

    def handle_data(self, data: str) -> None:
        text = re.sub(r"\s+", " ", data)
        if not text.strip():
            return

        if not self.stack:
            self._ensure_paragraph()

        self.output.append(html.escape(text))

    def get_html(self) -> str:
        self._close_auto_paragraph()
        while self.stack:
            self.output.append(f"</{self.stack.pop()}>")

        cleaned = "".join(self.output)
        cleaned = re.sub(r"<p>\s*</p>", "", cleaned)
        cleaned = re.sub(r"\s+</(p|li|blockquote|h2|h3|h4)>", r"</\1>", cleaned)
        cleaned = re.sub(r"<(p|li|blockquote|h2|h3|h4)>\s+", r"<\1>", cleaned)
        return cleaned.strip()


def clean_html_fragment(raw: str) -> str:
    parser = HtmlCleaner()
    parser.feed(preprocess_content(raw))
    parser.close()
    return parser.get_html()


def add_heading_ids(body_html: str) -> tuple[str, list[dict[str, object]]]:
    heading_counts: Counter[str] = Counter()
    headings: list[dict[str, object]] = []

    def replace_heading(match: re.Match[str]) -> str:
        level = int(match.group(1))
        inner_html = match.group(2)
        text = strip_tags(inner_html)
        if not text:
            return match.group(0)

        base_id = normalize_slug(text) or f"section-{len(headings) + 1}"
        heading_counts[base_id] += 1
        suffix = "" if heading_counts[base_id] == 1 else f"-{heading_counts[base_id]}"
        heading_id = f"{base_id}{suffix}"
        headings.append(
            {
                "id": heading_id,
                "text": text,
                "level": level,
            }
        )
        return f'<h{level} id="{heading_id}">{inner_html}</h{level}>'

    updated_html = re.sub(r"<h([23])>(.*?)</h\1>", replace_heading, body_html)
    return updated_html, headings


def extract_excerpt(body_html: str) -> str:
    paragraph_match = re.search(r"<p>(.*?)</p>", body_html, re.S)
    if paragraph_match:
        first_paragraph = strip_tags(paragraph_match.group(1))
        if first_paragraph:
            return truncate_text(first_paragraph)

    return truncate_text(strip_tags(body_html))


def count_words(value: str) -> int:
    return len(re.findall(r"\b[\w'-]+\b", value))


def choose_primary_category(categories: Iterable[BlogCategoryRef]) -> BlogCategoryRef | None:
    ordered_categories = list(categories)
    if not ordered_categories:
        return None

    for category in ordered_categories:
        if category.slug not in GENERIC_CATEGORY_SLUGS:
            return category

    return ordered_categories[0]


def build_post_record(item: ET.Element, attachments: dict[str, str]) -> dict[str, object]:
    title = (item.findtext("title") or "").strip()
    slug = (item.findtext("wp:post_name", namespaces=NS) or "").strip()
    raw_excerpt = (item.findtext("excerpt:encoded", namespaces=NS) or "").strip()
    raw_content = item.findtext("content:encoded", default="", namespaces=NS) or ""
    body_html = clean_html_fragment(raw_content)
    body_html, headings = add_heading_ids(body_html)
    excerpt = strip_tags(raw_excerpt) or extract_excerpt(body_html)
    plain_text = strip_tags(body_html)

    categories: list[BlogCategoryRef] = []
    for category_node in item.findall("category"):
        if category_node.attrib.get("domain") != "category":
            continue

        category_name = (category_node.text or "").strip()
        category_slug = category_node.attrib.get("nicename", "").strip() or normalize_slug(
            category_name
        )
        if not category_name or not category_slug:
            continue

        categories.append(BlogCategoryRef(name=category_name, slug=category_slug))

    primary_category = choose_primary_category(categories)

    meta = {}
    for meta_node in item.findall("wp:postmeta", NS):
        key = meta_node.findtext("wp:meta_key", default="", namespaces=NS)
        value = meta_node.findtext("wp:meta_value", default="", namespaces=NS) or ""
        if key:
            meta[key] = value.strip()

    thumbnail_id = meta.get("_thumbnail_id", "")
    hero_image_url = normalize_attachment_url(attachments.get(thumbnail_id, "")) or None

    published_at = parsedate_to_datetime(item.findtext("pubDate") or "").isoformat()

    return {
        "title": title,
        "slug": slug,
        "publishedAt": published_at,
        "author": (item.findtext("dc:creator", default="", namespaces=NS) or "Aushen Stone").strip()
        or "Aushen Stone",
        "categories": [category.__dict__ for category in categories],
        "primaryCategory": primary_category.__dict__ if primary_category else None,
        "heroImageUrl": hero_image_url,
        "excerpt": excerpt,
        "bodyHtml": body_html,
        "headings": headings,
        "readingTimeMinutes": max(1, math.ceil(count_words(plain_text) / 200)),
        "seoTitle": meta.get("_yoast_wpseo_title") or None,
        "seoDescription": meta.get("_yoast_wpseo_metadesc") or None,
    }


def main() -> int:
    args = parse_args()
    project_root = Path(__file__).resolve().parents[1]
    source_path = resolve_source_path(args.source, project_root)
    output_path = (args.output or (project_root / DEFAULT_OUTPUT)).resolve()

    root = ET.parse(source_path).getroot()
    channel = root.find("channel")
    if channel is None:
        raise RuntimeError("WordPress export does not contain a channel element.")

    attachments: dict[str, str] = {}
    for item in channel.findall("item"):
        if item.findtext("wp:post_type", default="", namespaces=NS) != "attachment":
            continue

        attachment_id = (item.findtext("wp:post_id", default="", namespaces=NS) or "").strip()
        attachment_url = item.findtext("wp:attachment_url", default="", namespaces=NS) or ""
        if attachment_id and attachment_url:
            attachments[attachment_id] = attachment_url

    posts: list[dict[str, object]] = []
    category_counts: Counter[tuple[str, str]] = Counter()

    for item in channel.findall("item"):
        post_type = item.findtext("wp:post_type", default="", namespaces=NS)
        status = item.findtext("wp:status", default="", namespaces=NS)
        if post_type != "post" or status != "publish":
            continue

        record = build_post_record(item, attachments)
        if not record["title"] or not record["slug"]:
            continue

        posts.append(record)

        primary_category = record.get("primaryCategory")
        if isinstance(primary_category, dict):
            category_counts[(primary_category["slug"], primary_category["name"])] += 1

    posts.sort(key=lambda post: post["publishedAt"], reverse=True)

    categories = [
        {
            "name": name,
            "slug": slug,
            "count": count,
        }
        for (slug, name), count in sorted(
            category_counts.items(),
            key=lambda item: (-item[1], item[0][1]),
        )
    ]

    banner = (
        "// This file is auto-generated by scripts/build-blog-data.py. Do not edit.\n"
    )
    file_contents = (
        banner
        + 'import type { BlogCategory, BlogPost } from "@/types/blog";\n\n'
        + f"export const BLOG_POSTS: BlogPost[] = {json.dumps(posts, ensure_ascii=False, indent=2)};\n\n"
        + f"export const BLOG_CATEGORIES: BlogCategory[] = {json.dumps(categories, ensure_ascii=False, indent=2)};\n"
    )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(file_contents, encoding="utf-8")

    print(f"source={source_path}")
    print(f"output={output_path}")
    print(f"posts={len(posts)}")
    print(f"categories={len(categories)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
