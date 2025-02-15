const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middleware/authMiddleware');
const Post = require('../models/Post');


// 📌 Agregar un comentario a un post
router.post('/:postId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const author = req.user.userId;
    const postId = req.params.postId;

    const newComment = new Comment({ content, author, post: postId });
    await newComment.save();

    // Agregar el comentario al post
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Error al agregar comentario", error: error.message });
  }
});

// 📌 Obtener comentarios de un post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener comentarios", error: error.message });
  }
});

module.exports = router;
