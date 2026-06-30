const jwt = require('jsonwebtoken');

// Middleware pour vérifier que l'utilisateur est connecté
exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Accès refusé. Token manquant ou invalide." });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // On attache les infos (id, role) à req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Accès refusé. Token expiré ou invalide." });
  }
};

// Middleware pour vérifier un rôle spécifique (ex: trainer)
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({ message: `Accès interdit. Rôle '${role}' requis.` });
    }
    next();
  };
};
