const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

/* GET /api/articles?page=1&limit=6&category=សេដ្ឋកិច្ច
   Returns a paginated list of articles */
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 6, 1);
    const filter = req.query.category ? { category: req.query.category } : {};

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Article.countDocuments(filter),
    ]);

    res.json({
      articles,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      totalArticles: total,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch articles", error: err.message });
  }
});

/* GET /api/articles/popular */
router.get("/popular", async (req, res) => {
  try {
    const articles = await Article.find({ isPopular: true }).sort({ views: -1 }).limit(5);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch popular articles", error: err.message });
  }
});

/* GET /api/articles/:id */
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    article.views += 1;
    await article.save();
    res.json(article);
  } catch (err) {
    res.status(400).json({ message: "Invalid article id", error: err.message });
  }
});

/* POST /api/articles  (create) */
router.post("/", async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (err) {
    res.status(400).json({ message: "Failed to create article", error: err.message });
  }
});

/* PUT /api/articles/:id  (update) */
router.put("/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json(article);
  } catch (err) {
    res.status(400).json({ message: "Failed to update article", error: err.message });
  }
});

/* DELETE /api/articles/:id */
router.delete("/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete article", error: err.message });
  }
});

module.exports = router;
