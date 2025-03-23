const express = require("express");
const router = express.Router();
const { fetchCVEsByKeyword } = require("../../services/cveServices");

router.get("/:keyword", async (req, res) => {
  const keyword = req.params.keyword;

  const results = await fetchCVEsByKeyword(keyword);
  res.json(results);
});

module.exports = router;
