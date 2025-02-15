const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  reactions: {
    "❤️": [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    "🦄": [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    "😲": [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    "🙌": [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    "🔥": [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }] // Relación con los comentarios
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
