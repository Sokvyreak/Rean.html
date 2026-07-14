require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const articleRoutes = require("./routes/articles");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/articles", articleRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`SME News API running on http://localhost:${PORT}`);
});
