/* ==========================================================
   Alternative server entry point using MySQL instead of MongoDB.
   Requires: npm install mysql2 express cors dotenv (in this folder)
   Run with: node mysql-alternative/server.mysql.js
   ========================================================== */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "sme_news",
  waitForConnections: true,
  connectionLimit: 10,
});

// GET /api/articles?page=1&limit=6&category=...
app.get("/api/articles", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 6, 1);
    const offset = (page - 1) * limit;
    const category = req.query.category;

    const where = category ? "WHERE category = ?" : "";
    const params = category ? [category] : [];

    const [rows] = await pool.query(
      `SELECT * FROM articles ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM articles ${where}`,
      params
    );

    res.json({
      articles: rows,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1),
      totalArticles: total,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch articles", error: err.message });
  }
});

// GET /api/articles/popular
app.get("/api/articles/popular", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM articles WHERE is_popular = TRUE ORDER BY views DESC LIMIT 5"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch popular articles", error: err.message });
  }
});

// GET /api/articles/:id
app.get("/api/articles/:id", async (req, res) => {
  try {
    await pool.query("UPDATE articles SET views = views + 1 WHERE id = ?", [req.params.id]);
    const [rows] = await pool.query("SELECT * FROM articles WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Article not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: "Invalid article id", error: err.message });
  }
});

// POST /api/articles
app.post("/api/articles", async (req, res) => {
  try {
    const { title, excerpt, body, category, image, author, isFeatured, isPopular } = req.body;
    const [result] = await pool.query(
      `INSERT INTO articles (title, excerpt, body, category, image, author, is_featured, is_popular)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, excerpt, body, category, image, author || "SME News", !!isFeatured, !!isPopular]
    );
    const [rows] = await pool.query("SELECT * FROM articles WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ message: "Failed to create article", error: err.message });
  }
});

// DELETE /api/articles/:id
app.delete("/api/articles/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM articles WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: "Article not found" });
    res.json({ message: "Article deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete article", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`SME News API (MySQL) running on http://localhost:${PORT}`);
});
