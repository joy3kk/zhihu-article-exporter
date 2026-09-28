const form = document.getElementById("form");
const input = document.getElementById("url");
const button = document.getElementById("submit");
const status = document.getElementById("status");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

form.addEventListener("submit", async event => {
  event.preventDefault();
  button.disabled = true;
  status.textContent = "正在读取文章…";
  try {
    const url = new URL(input.value.trim());
    const match = /^\/p\/(\d+)\/?$/.exec(url.pathname);
    if (url.protocol !== "https:" || url.hostname !== "zhuanlan.zhihu.com" || !match) {
      throw new Error("请输入知乎专栏文章链接。");
    }
    const articleUrl = `https://zhuanlan.zhihu.com/p/${match[1]}`;
    const tabs = await chrome.tabs.query({ url: "https://zhuanlan.zhihu.com/p/*" });
    const existing = tabs.find(tab => tab.url?.split("?")[0] === articleUrl);
    const tab = existing || await chrome.tabs.create({ url: articleUrl, active: false });

    let article;
    for (let attempt = 0; attempt < 20; attempt++) {
      try {
        const results = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: extractArticle });
        article = results[0]?.result;
      } catch { /* 页面仍在加载。 */ }
      if (article) break;
      await delay(1000);
    }
    if (!article) throw new Error("未读到正文。请在浏览器中打开这篇文章，确认内容已显示后重试。");

    await chrome.downloads.download({
      url: `data:text/markdown;charset=utf-8,${encodeURIComponent(article.markdown)}`,
      filename: `zhihu-${match[1]}.md`,
      conflictAction: "uniquify",
      saveAs: false
    });
    status.textContent = `已下载：zhihu-${match[1]}.md`;
  } catch (error) {
    status.textContent = error.message || "提取失败。";
  } finally {
    button.disabled = false;
  }
});
