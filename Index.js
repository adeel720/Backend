const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();

app.use(cors()); // Important for frontend access

// ✅ API: Fetch QuoteX Pairs
app.get("/api/pairs", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    await page.goto("https://quotex.com/en/trade", { waitUntil: "networkidle2" });

    // Wait for the pairs to load
    await page.waitForSelector(".asset-select__asset");

    const pairs = await page.evaluate(() => {
      const elements = document.querySelectorAll(".asset-select__asset");
      return Array.from(elements).map(el => el.textContent.trim());
    });

    await browser.close();
    res.json({ pairs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pairs", details: err.message });
  }
});

app.listen(3000, () => {
  console.log("✅ Server is running on port 3000");
});
