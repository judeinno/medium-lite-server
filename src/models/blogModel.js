const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: String,
    categories: [String],
    authorId: String,
    content: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;