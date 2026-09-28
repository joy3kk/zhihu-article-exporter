# 知乎文章本地导出工具

从浏览器保存的知乎文章网页中提取标题、作者、正文和图片链接，生成 Markdown 文件。

## 使用方法

1. 在浏览器中打开文章，等待正文和所需图片显示完整。
2. 使用浏览器的“网页另存为”功能，将页面保存为 HTML 文件。
3. 安装依赖并运行导出命令：

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python export_article.py "文章.html" -o "文章.md"
```

输出文件包含原文链接。图片以原始链接写入 Markdown，查看图片时需要网络连接。

## 示例文章

[如何在虚幻引擎中制作3A级交互雪地](https://zhuanlan.zhihu.com/p/685176003)

打开示例文章并保存网页后，将保存的 HTML 文件路径传给脚本即可。

## 项目文件

- `export_article.py`：提取文章并生成 Markdown。
- `requirements.txt`：运行依赖。
- `test_export_article.py`：提取功能检查。

文章网页和导出结果保存在本地。公开仓库用于分享工具代码；分享文章内容时请先取得相应授权。
