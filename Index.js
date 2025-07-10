const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

app.get("/api/candles", async (req, res) => {
  const { pair = "USD/BRL OTC", tf = "5s" } = req.query;
  try {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto("https://quotex.com/en/trade");

    // Simulated example - customize to scrape real candles
    const candles = [
      { time: Date.now(), open: 1.234, high: 1.240, low: 1.230, close: 1.237 },
      { time: Date.now() - 5000, open: 1.237, high: 1.239, low: 1.233, close: 1.235 }
    ];

    await browser.close();
    res.json({ pair, tf, candles });
  } catch (err) {
    res.status(500).json({ error: "Scraping failed", details: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
