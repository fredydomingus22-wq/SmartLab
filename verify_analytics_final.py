
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:3000/data-intelligence/executive-overview")
        await page.wait_for_timeout(2000) # Wait for charts to render
        await page.screenshot(path="/home/jules/verification/executive_overview_final.png")
        await browser.close()

asyncio.run(main())
