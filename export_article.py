"""Extract a Zhihu article from an HTML file saved in a browser."""

import argparse
from pathlib import Path
from urllib.parse import urljoin

from bs4 import BeautifulSoup
from markdownify import markdownify


def extract_article(html: str, source_url: str = "") -> str:
    soup = BeautifulSoup(html, "html.parser")
    title = soup.select_one("h1.Post-Title, article h1, h1")
    body = soup.select_one(
        "article .Post-RichText, .Post-RichText, "
        ".Post-RichTextContainer .RichText, .Post-RichTextContainer, article .RichText"
    )
    if title is None or body is None:
        raise ValueError("未找到文章标题或正文。请在文章完整显示后保存网页 HTML。")

    canonical = soup.select_one('link[rel="canonical"]')
    source_meta = soup.select_one('meta[property="og:url"]')
    source = source_url or (canonical.get("href", "") if canonical else "")
    source = source or (source_meta.get("content", "") if source_meta else "")
    author_name = next(
        (node.get_text(" ", strip=True) for node in soup.select(".AuthorInfo-name, .Post-Author .UserLink-link")
         if node.get_text(" ", strip=True)),
        "",
    )
    if not author_name:
        author_meta = soup.select_one('meta[name="author"]')
        author_name = author_meta.get("content", "") if author_meta else ""

    for unwanted in body.select("script, style, noscript, button"):
        unwanted.decompose()
    for image in body.select("img"):
        image_url = next(
            (image.get(key) for key in ("data-original", "data-actualsrc", "data-src", "src") if image.get(key)),
            "",
        )
        if image_url:
            image["src"] = urljoin(source, image_url) if image_url.startswith("/") else image_url

    content = markdownify(str(body), heading_style="ATX").strip()
    if not content:
        raise ValueError("正文为空。请确认保存的是文章页面。")
    lines = [f"# {title.get_text(' ', strip=True)}"]
    if author_name:
        lines.append(f"作者：{author_name}")
    if source:
        lines.append(f"来源：{source}")
    return "\n\n".join([*lines, content]) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="从浏览器保存的知乎文章 HTML 导出 Markdown")
    parser.add_argument("html", type=Path, help="浏览器保存的网页 HTML 文件")
    parser.add_argument("-o", "--output", type=Path, help="输出文件，默认为同名 .md 文件")
    args = parser.parse_args()
    output = args.output or args.html.with_suffix(".md")
    output.write_text(extract_article(args.html.read_text(encoding="utf-8")), encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
