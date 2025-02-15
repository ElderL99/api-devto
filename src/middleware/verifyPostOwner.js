const Post = require('../models/Post');

const verifyPostOwner = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: "No tienes permiso para modificar este post" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error en la verificación de propiedad", error: error.message });
  }
};

module.exports = verifyPostOwner;
