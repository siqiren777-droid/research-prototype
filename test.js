const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const fileUrl = `file://${path.join(__dirname, "index.html")}`;

async function openScreen(page, screen) {
  await page.goto(`${fileUrl}?screen=${screen}`, { waitUntil: "networkidle" });
  return page.locator("#pageTitle").textContent();
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));

  assert.strictEqual(await openScreen(page, "pm"), "研究速览");
  assert.strictEqual(await openScreen(page, "researcher"), "研究员工作台");
  assert.strictEqual(await openScreen(page, "company"), "公司视图");
  assert.strictEqual(await openScreen(page, "archive"), "成果中心");
  assert.strictEqual(await openScreen(page, "governance"), "事项管理");

  await openScreen(page, "pm");
  const pmText = await page.locator("body").innerText();
  assert(pmText.includes("关注标的"));
  assert(pmText.includes("研究问答"));
  await page.locator("[data-action='ask-ai']").first().click();
  assert.strictEqual(await page.locator("#pmAiAnswer").evaluate((node) => node.classList.contains("hidden")), false);
  await page.locator("[data-action='open-company']").first().click();
  assert.strictEqual(await page.locator("#pageTitle").textContent(), "公司视图");

  await openScreen(page, "researcher");
  assert((await page.locator("body").innerText()).includes("发布研究更新"));
  await page.locator("[data-action='publish-dynamic']").click();
  assert.strictEqual(await page.locator("[data-action='publish-dynamic']").textContent(), "已发布");
  assert.strictEqual(await page.locator("#publishedCount").textContent(), "3");

  await openScreen(page, "archive");
  assert((await page.locator("body").innerText()).includes("正式成果"));
  await page.locator("[data-action='search-archive']").click();
  assert((await page.locator(".toast").innerText()).includes("正在检索正式成果"));

  await openScreen(page, "governance");
  assert((await page.locator("body").innerText()).includes("研究事项"));
  await page.locator("[data-action='export-audit']").click();
  assert((await page.locator(".toast").innerText()).includes("审计记录"));

  assert.deepStrictEqual(errors, []);

  const mobileOutput = "/tmp/investment-research-prototype-mobile";
  fs.mkdirSync(mobileOutput, { recursive: true });
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const screen of ["pm", "researcher", "company", "archive", "governance"]) {
    await mobile.goto(`${fileUrl}?screen=${screen}`, { waitUntil: "networkidle" });
    const hasOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    assert.strictEqual(hasOverflow, false, `${screen} has horizontal overflow`);
    await mobile.screenshot({ path: path.join(mobileOutput, `${screen}.png`), fullPage: true });
  }

  await browser.close();
  console.log("Prototype tests passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
