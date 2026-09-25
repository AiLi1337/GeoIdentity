"""Optional browser regression: run against a local Vite server with Playwright installed."""

import sys

from playwright.sync_api import sync_playwright


def check(base_url: str, width: int, height: int) -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        try:
            page = browser.new_page(viewport={"width": width, "height": height})
            page.goto(base_url, wait_until="domcontentloaded")

            assert page.get_by_text("JP · +81").count() == 1
            page.locator("button").filter(has_text="JP · +81").first.click()
            assert page.get_by_text("内置地址样本（投递与 AVS 未核验）").count() == 1

            page.locator("button").filter(has_text="方案A·街道门牌衍生").first.click()
            assert page.get_by_text("方案A·门牌插值").count() >= 1

            if width < 768:
                page.get_by_role("button", name="More Options").click()
                page.get_by_role("button", name="批量生成").last.click()
            else:
                page.locator('button[title="批量生成"]').first.click()
            assert page.get_by_text("已生成 10 条合成测试资料", exact=False).count() == 1
            assert page.get_by_text("方案B·住宅样本").count() >= 1
            page.get_by_role("button", name="关闭", exact=True).last.click()

            page.locator("button").filter(has_text="US · +1").first.click()
            page.get_by_role("button", name="OSM 来源建筑门牌", exact=False).first.click()
            page.locator("button").filter(has_text="JP · +81").first.click()
            assert page.get_by_role("alert").filter(has_text="暂无可核对来源").count() == 1

            if width < 768:
                page.get_by_role("button", name="监控", exact=True).first.click()
            else:
                page.locator('button[title="地址库监控"]:visible').first.click()
            assert page.get_by_text("全球地址样本概览").count() == 1
            assert page.get_by_text("内置住宅样本").count() >= 1
            print(f"Address workflows OK at {width}x{height}")
        finally:
            browser.close()


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:5182/"
    check(url, 1365, 900)
    check(url, 390, 844)
