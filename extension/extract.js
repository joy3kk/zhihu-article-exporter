function extractArticle() {
  const title = document.querySelector("h1.Post-Title, article h1");
  const body = document.querySelector("article .Post-RichText, .Post-RichText");
  if (!title || !body) return null;

  const copy = body.cloneNode(true);
  copy.querySelectorAll("script, style, noscript, button").forEach(node => node.remove());
  const source = document.querySelector('meta[property="og:url"]')?.content || location.href.split("?")[0];
  const author = [...document.querySelectorAll(".AuthorInfo-name, .Post-Author .UserLink-link")]
    .map(node => node.textContent.trim()).find(Boolean);

  function inline(node) {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\s+/g, " ");
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const tag = node.tagName;
    if (tag === "BR") return "\n";
    if (tag === "IMG") {
      const src = node.getAttribute("data-original") || node.getAttribute("data-actualsrc") ||
        node.getAttribute("data-src") || node.getAttribute("src");
      return src ? `![${node.getAttribute("alt") || ""}](${src})` : "";
    }
    const text = [...node.childNodes].map(inline).join("");
    if (tag === "A") return node.href ? `[${text || node.href}](${node.href})` : text;
    if (tag === "STRONG" || tag === "B") return `**${text}**`;
    if (tag === "EM" || tag === "I") return `*${text}*`;
    if (tag === "CODE") return `\`${text}\``;
    return text;
  }

  function block(node) {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim();
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const tag = node.tagName;
    if (/^H[1-6]$/.test(tag)) return `${"#".repeat(Number(tag[1]))} ${inline(node).trim()}`;
    if (tag === "P" || tag === "IMG") return inline(node).trim();
    if (tag === "PRE") return `\`\`\`\n${node.textContent.trim()}\n\`\`\``;
    if (tag === "BLOCKQUOTE") return inline(node).trim().split("\n").map(line => `> ${line}`).join("\n");
    if (tag === "UL" || tag === "OL") return [...node.children].map((item, index) =>
      `${tag === "OL" ? `${index + 1}.` : "-"} ${inline(item).trim()}`).join("\n");
    return [...node.childNodes].map(block).filter(Boolean).join("\n\n");
  }

  const content = [...copy.childNodes].map(block).filter(Boolean).join("\n\n").replace(/\n{3,}/g, "\n\n");
  if (!content) return null;
  const heading = title.textContent.trim();
  const metadata = [author && `作者：${author}`, `来源：${source}`].filter(Boolean);
  return { title: heading, markdown: [`# ${heading}`, ...metadata, content].join("\n\n") + "\n" };
}
