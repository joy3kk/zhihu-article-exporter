import unittest

from export_article import extract_article


class ExportArticleTest(unittest.TestCase):
    def test_extracts_article_and_lazy_image(self):
        html = """
        <link rel="canonical" href="https://zhuanlan.zhihu.com/p/685176003">
        <h1 class="Post-Title">交互雪地</h1>
        <span class="AuthorInfo-name">腾讯游戏学堂</span>
        <div class="Post-RichTextContainer"><div class="RichText">
          <p>正文第一段。</p><h2>制作步骤</h2>
          <p><img data-original="https://example.com/snow.jpg" src="data:image/gif;base64,abc"></p>
          <script>doNotInclude()</script>
        </div></div>
        """
        result = extract_article(html)
        self.assertIn("# 交互雪地", result)
        self.assertIn("作者：腾讯游戏学堂", result)
        self.assertIn("正文第一段。", result)
        self.assertIn("## 制作步骤", result)
        self.assertIn("https://example.com/snow.jpg", result)
        self.assertNotIn("doNotInclude", result)


if __name__ == "__main__":
    unittest.main()
