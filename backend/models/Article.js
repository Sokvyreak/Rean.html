const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: "" },
    body: { type: String, default: "" },
    category: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    author: { type: String, default: "SME News" },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
