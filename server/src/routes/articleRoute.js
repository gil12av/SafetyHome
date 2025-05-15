const express = require("express");
const axios = require("axios");
const Article = require("../models/Article");

const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

router.post("/fetch-news", async (req, res) => {
    try {
      const NEWS_API_KEY = process.env.NEWS_API_KEY;
  
      if (!NEWS_API_KEY) {
        return res.status(500).json({ error: "Missing NEWS_API_KEY" });
      }
  
      // נושאים רלוונטיים בלבד
      const topics = [
        "iot device security",
        "router password vulnerability",
        "why strong passwords matter",
        "cve vulnerability",
        "smart home hacking",
        "home network breach",
        "iot malware",
        "wifi hacking home",
      ];
  
      const query = encodeURIComponent(topics.map(t => `"${t}"`).join(" OR "));
  
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}&excludeDomains=nytimes.com,cnn.com,bloomberg.com`
      );
  
      const articles = response.data.articles;
  
      const savedArticles = await Promise.all(
        articles.map(async (a) => {
          const exists = await Article.findOne({ url: a.url });
          if (exists) return null;
  
          const newArticle = new Article({
            title: a.title,
            description: a.description,
            url: a.url,
            urlToImage: a.urlToImage,
            publishedAt: a.publishedAt,
            source: a.source?.name,
          });
  
          return await newArticle.save();
        })
      );
  
      const filtered = savedArticles.filter(Boolean);
      res.status(201).json({ saved: filtered.length });
    } catch (err) {
      console.error("❌ Error fetching news:", err.message);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });
  

router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedAt: -1 }).limit(15);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to get articles" });
  }
});

module.exports = router;
