const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); 

// Obtener todos los posts
router.get('/', async (req, res) => {
  try {
    console.log("📡 Recibida petición GET /api/posts");
    const posts = await Post.find(); 
    console.log("✅ Posts encontrados:", posts);
    res.json(posts);
  } catch (error) {
    console.error("❌ Error en GET /api/posts:", error.message);
    res.status(500).json({ message: "Error al obtener los posts", error: error.message });
  }
});

// Crear un nuevo post
router.post('/', async (req, res) => {
  try {
    console.log("📡 Recibida petición POST /api/posts");
    console.log("📨 Datos recibidos:", req.body);

    const { title, content, author, tags } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const newPost = new Post({ title, content, author, tags }); 
    const savedPost = await newPost.save();

    console.log("✅ Post guardado correctamente:", savedPost);
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("❌ Error en POST /api/posts:", error.message);
    res.status(500).json({ message: "Error al guardar el post", error: error.message });
  }
});

module.exports = router;
