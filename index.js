require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// 🚀 Configuración para manejar errores en conexión a MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Conectado a MongoDB - Base de Datos: Devto');

    // Verificar qué bases de datos existen
    const databases = await mongoose.connection.db.admin().listDatabases();
    console.log('📡 Bases de datos en el servidor:', databases.databases);
  } catch (err) {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1); // Detener la ejecución si la conexión falla
  }
}

connectDB();

app.use(cors());
app.use(express.json()); // Middleware para JSON

// Importar y usar rutas
const postRoutes = require('./src/routes/postRoutes');
app.use('/api/posts', postRoutes); 

// Manejo de rutas que no existen
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
