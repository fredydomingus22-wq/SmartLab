
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Capture console messages
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

        await page.goto("http://localhost:3000/data-intelligence/executive-overview")
        await page.wait_for_timeout(2000) # Wait for API calls
        await page.screenshot(path="/home/jules/verification/executive_overview_fixed.png")
        await browser.close()

asyncio.run(main())
