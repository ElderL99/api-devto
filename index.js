require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db'); // Conectar a MongoDB
const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');
const commentRoutes = require('./src/routes/commentRoutes');

const app = express();
const port = process.env.PORT || 4000;

// Conectar a la base de datos
connectDB();

app.use(cors());
app.use(express.json()); // Middleware para manejar JSON

// Rutas de autenticación y posts
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Ruta no encontrada
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));

// Iniciar servidor
app.listen(port, () => console.log(`🚀 Servidor corriendo en http://localhost:${port}`));
