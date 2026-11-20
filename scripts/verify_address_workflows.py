"""Optional browser regression: run against a local Vite server with Playwright installed."""

import sys
import re

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
            osm_button = page.get_by_role("button", name=re.compile(r"^OSM 住宅建筑门牌"))
            osm_button.click()
            saved_mode = page.evaluate('localStorage.getItem("geo_address_mode")')
            assert saved_mode == "sourced", (saved_mode, page.get_by_role("alert").all_text_contents())
            page.reload(wait_until="domcontentloaded")
            assert "border-amber-500" in osm_button.get_attribute("class")
            assert page.get_by_text("OSM 公开建筑门牌（收件未核验）").count() == 1
            page.locator("select").filter(has=page.locator('option[value="OR"]')).select_option("OR")
            assert page.get_by_role("link", name="核对 OSM 原始对象").count() == 1
            assert page.get_by_text("OSM 住宅建筑门牌", exact=True).count() >= 1
            page.locator("button").filter(has_text="JP · +81").first.click()
            assert page.get_by_role("alert").filter(has_text="暂无可核对来源").count() == 1

            page.locator("button").filter(has_text="方案C·建筑样本" if width < 768 else "方案C：建筑地址样本").first.click()
            page.locator("select").filter(has=page.locator('option[value="01"]')).select_option("01")
            assert page.get_by_role("alert").count() == 0

            # Tax-free filter on non-tax-free country (JP) must error explicitly in both single and batch modes
            page.get_by_role("button", name="仅生成免税 / 低税地区地址").click()
            assert page.get_by_role("alert").filter(has_text="暂无符合该模式").count() == 1
            if width < 768:
                page.get_by_role("button", name="More Options").click()
                page.get_by_role("button", name="批量生成").last.click()
            else:
                page.locator('button[title="批量生成"]').first.click()
            assert page.get_by_role("alert").filter(has_text="暂无符合该模式").count() >= 1
            assert page.get_by_text("已生成 0 条合成测试资料", exact=False).count() == 1
            page.get_by_role("button", name="关闭", exact=True).last.click()
            page.get_by_role("button", name="仅生成免税 / 低税地区地址").click()

            # 4-mode comparison guide & OSM active badge
            page.get_by_role("button", name="方案对比").click()
            assert page.get_by_text("四类地址方案完整对比").count() == 1
            assert page.get_by_text("OSM 住宅建筑门牌").count() >= 2
            assert page.get_by_text("当前启用").count() >= 1

            # HK & TW repeated generation in derivation mode produces multiple geographies (and HK has no 999077)
            page.locator("button").filter(has_text="方案A·街道门牌衍生" if width < 768 else "方案A：街道门牌区间插值").first.click()
            for country_btn, expected_min in [("HK · +852", 2), ("TW · +886", 2)]:
                page.locator("button").filter(has_text=country_btn).first.click()
                state_select = page.locator("select").filter(has=page.locator('option[value=""]')).first
                assert state_select.input_value() == ""
                seen_cities = set()
                for _ in range(12):
                    page.get_by_role("button", name="立即生成全新身份").click()
                    seen_cities.add(page.locator("div.text-sm.font-semibold").nth(2).inner_text())
                assert len(seen_cities) >= expected_min, (country_btn, seen_cities)
                if "HK" in country_btn:
                    assert page.get_by_text("999077").count() == 0

            # Reload does not implicitly lock selectedState
            page.reload(wait_until="domcontentloaded")
            state_select = page.locator("select").filter(has=page.locator('option[value=""]')).first
            assert state_select.input_value() == "", "Reload must not implicitly lock selectedState"

            # Explicit state selection IS strictly preserved in single and batch generation
            page.locator("button").filter(has_text="HK · +852").first.click()
            page.locator("select").filter(has=page.locator('option[value="WC"]')).select_option("WC")
            assert page.locator("select").filter(has=page.locator('option[value="WC"]')).input_value() == "WC"
            page.get_by_role("button", name="立即生成全新身份").click()
            identity_card = page.get_by_test_id("identity-card")
            assert identity_card.count() == 1
            card_text = identity_card.inner_text()
            assert ("Wan Chai" in card_text or "灣仔" in card_text), card_text
            assert "WC" in card_text, card_text

            if width < 768:
                page.get_by_role("button", name="More Options").click()
                page.get_by_role("button", name="批量生成").last.click()
            else:
                page.locator('button[title="批量生成"]').first.click()
            state_cells = page.locator("tbody tr td:nth-child(7)")
            assert state_cells.count() == 10
            for index in range(state_cells.count()):
                assert "WC" in state_cells.nth(index).inner_text(), state_cells.nth(index).inner_text()
            page.get_by_role("button", name="关闭", exact=True).last.click()

            # Monitor health check passes
            if width < 768:
                page.get_by_role("button", name="监控", exact=True).first.click()
            else:
                page.locator('button[title="地址库监控"]:visible').first.click()
            assert page.get_by_text("全球地址样本概览").count() == 1
            assert page.get_by_text("内置住宅样本").count() >= 1
            page.get_by_role("button", name="校验当前数据").click()
            assert page.get_by_text("本地数据的门牌、城市、邮编、坐标格式及总数检查通过").count() == 1

            # Check no horizontal overflow on narrow viewport
            overflow = page.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            assert overflow <= 2, f"Horizontal overflow {overflow}px at {width}x{height}"
            print(f"Address workflows OK at {width}x{height}")
        finally:
            browser.close()


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:5182/"
    check(url, 1365, 900)
    check(url, 390, 844)
