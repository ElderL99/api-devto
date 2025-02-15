const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authMiddleware');
const verifyPostOwner = require('../middleware/verifyPostOwner');

const router = express.Router();

// 📌 Crear un nuevo post (solo usuarios autenticados)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const author = req.user.userId; 
    const newPost = new Post({ title, content, author, tags });
    const savedPost = await newPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el post', error: error.message });
  }
});

// 📌 Obtener todos los posts (incluyendo el nombre del autor)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username') // Obtener el nombre del autor del post
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' } // Obtener los autores de los comentarios
      });

    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el post", error: error.message });
  }
});




//// 📌 Agregar o quitar una reacción a un post
router.post('/:id/react', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { reaction } = req.body; // Emoji de la reacción (❤️, 🦄, 😲, 🙌, 🔥)
    const userId = req.user.userId;

    if (!["❤️", "🦄", "😲", "🙌", "🔥"].includes(reaction)) {
      return res.status(400).json({ message: "Reacción no válida" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    // Si el usuario ya reaccionó con ese emoji, quitamos la reacción
    if (post.reactions[reaction].includes(userId)) {
      post.reactions[reaction] = post.reactions[reaction].filter(uid => uid.toString() !== userId);
    } else {
      post.reactions[reaction].push(userId);
    }

    await post.save();
    res.json({ message: "Reacción actualizada", reactions: post.reactions });
  } catch (error) {
    res.status(500).json({ message: "Error al reaccionar", error: error.message });
  }
});


router.delete('/:id', authMiddleware, verifyPostOwner, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post eliminado" });
});

router.put('/:id', authMiddleware, verifyPostOwner, async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el post", error: error.message });
  }
});

module.exports = router;
