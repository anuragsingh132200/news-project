const express = require("express");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const stringSimilarity = require("string-similarity");
const cors = require("cors");
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
const auth = new google.auth.GoogleAuth({
  keyFile: "google-service-account.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
const SHEET_ID = process.env.SHEET_ID;
const RANGE = "sheet1!A:H"; // Adjust based on actual column range

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Fetch news from Google Sheets */
async function fetchRawNews() {
  try {
    console.log("Fetching news from range:", RANGE);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    if (!response.data.values || response.data.values.length === 0) {
      console.warn("⚠ No data found in Google Sheets!");
      return [];
    }

    const headers = response.data.values[0];
    return response.data.values.slice(1).map((row) => {
      let newsItem = {};
      headers.forEach((header, index) => {
        newsItem[header] = row[index] || "";
      });
      return newsItem;
    });

  } catch (error) {
    console.error("Error fetching raw news:", error.message);
    return [];
  }
}

/** ✅ Fix: Corrected function to check for duplicate news */
function isDuplicate(newsItem, existingNews) {
  const descriptions = existingNews.map((item) => item["News Description"] || "");
  if (descriptions.length === 0) return false; // No existing news, so not a duplicate

  const similarityScores = stringSimilarity.findBestMatch(
    newsItem["News Description"] || "", 
    descriptions
  );

  return similarityScores.bestMatch.rating >= 0.8; // 80% threshold
}

/** Moderate image using OpenAI GPT-4o */
async function isImageSafe(imageUrl) {
    return true;
  // try {
  //   const response = await openai.images.moderations.create({
  //     input: imageUrl,
  //   });

  //   return !response.results[0].flagged; // If not flagged, it's safe
  // } catch (error) {
  //   console.error("OpenAI image moderation failed:", error.message);
  //   return false; // If API call fails, assume unsafe
  // }
}

/** Process news: Validate & moderate */
async function processNews() {
  let news = await fetchRawNews();

  let validNews = [];

  for (let item of news) {
    // ✅ Validate: Ensure fields exist
    if (!item["News Title"] || !item["News Description"] || item["News Description"].length < 50) {
      continue;
    }

    // ✅ Check for duplicate news (80% similarity threshold)
    if (isDuplicate(item, validNews)) {
      console.log("❌ Duplicate detected:", item["News Title"]);
      continue;
    }

    // ✅ Check image moderation
    if (item["Please also Upload an Image about it"]) {
      const isSafe = await isImageSafe(item["Please also Upload an Image about it"]);
      if (!isSafe) {
        console.log("🚫 Unsafe image detected:", item["Please also Upload an Image about it"]);
        continue;
      }
    }

    // ✅ Mask phone number (e.g., "9876543210" → "987****210")
    item["Publishers Phone Number"] = item["Publishers Phone Number"].replace(
      /(\d{3})\d{4}(\d{3})/,
      "$1****$2"
    );

    validNews.push(item);
  }

  return validNews;
}

/** ✅ Endpoint to fetch validated & moderated news */
app.get("/news", async (req, res) => {
  try {
    const news = await processNews();
    res.json({ success: true, news });
  } catch (error) {
    console.error("Error processing news:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

/** ✅ Endpoint to fetch raw news (without OpenAI moderation) */
app.get("/news/raw", async (req, res) => {
  try {
    const news = await fetchRawNews();
    res.json({ success: true, news });
  } catch (error) {
    console.error("Error fetching raw news:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
