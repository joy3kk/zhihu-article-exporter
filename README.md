# 知乎文章导出工具

在浏览器扩展窗口输入知乎专栏文章链接，点击“提取并下载”，将文章标题、作者、正文和图片链接保存为 Markdown 文件。

## 安装浏览器扩展

1. 在 Chrome 中打开 `chrome://extensions`，或在 Edge 中打开 `edge://extensions`。
2. 开启“开发者模式”，点击“加载已解压的扩展程序”。
3. 选择本项目的 `extension` 文件夹。
4. 将“知乎文章导出”固定到浏览器工具栏，方便打开窗口。

## 导出文章

1. 点击工具栏中的“知乎文章导出”。
2. 输入文章链接，例如 `https://zhuanlan.zhihu.com/p/685176003`。
3. 点击“提取并下载”。文件会保存到浏览器的下载目录。

扩展会读取同一浏览器中已打开的文章页面。页面需要登录时，先在该浏览器中正常打开文章，确认正文显示完整，再点击提取按钮。

Markdown 中的图片使用网页上的图片链接，查看图片时需要网络连接。文章内容由你本地保存；公开分享文章内容时请先取得相应授权。

## 本地 HTML 导出

浏览器保存的网页也可以用命令行脚本导出。先安装 Python 依赖：

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python export_article.py "文章.html" -o "文章.md"
```

导出文件与浏览器保存的网页资源文件夹放在同一目录时，Markdown 中的本地图片路径可以直接使用。

## 项目文件

- `extension/`：浏览器扩展界面和网页提取代码。
- `export_article.py`：本地 HTML 导出脚本。
- `requirements.txt`：本地 HTML 导出脚本的依赖。
- `test_export_article.py`：提取功能检查。
