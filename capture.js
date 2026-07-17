const path = require("path");
const { chromium } = require("playwright");

const root = __dirname;
const fileUrl = `file://${path.join(root, "index.html")}`;
const screens = [
  ["pm", "01-基金经理工作台.png"],
  ["researcher", "02-研究员工作台.png"],
  ["company", "03-公司研究速览.png"],
  ["archive", "04-正式成果聚合视图.png"],
  ["governance", "05-P2治理扩展.png"]
];

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1 });
  for (const [screen, filename] of screens) {
    await page.goto(`${fileUrl}?screen=${screen}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(root, filename), fullPage: true });
    console.log(`${filename} captured: ${await page.locator("#pageTitle").textContent()}`);
  }
  await browser.close();
})();
