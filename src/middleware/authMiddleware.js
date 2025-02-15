const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  console.log("🔹 Token recibido:", token); 

  if (!token) return res.status(401).json({ message: 'Acceso denegado. No hay token' });

  try {
    if (!token.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Formato de token inválido' });
    }

    const tokenWithoutBearer = token.split(' ')[1];
    console.log("🔹 Token sin 'Bearer':", tokenWithoutBearer); 

    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified;
    console.log("✅ Usuario verificado:", verified); 

    next();
  } catch (error) {
    console.error("❌ Error en verificación del token:", error.message);
    res.status(400).json({ message: 'Token inválido o expirado', error: error.message });
  }
};




module.exports = authMiddleware;
