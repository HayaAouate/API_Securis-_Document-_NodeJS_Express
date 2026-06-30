const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

exports.register = async (req, res) => {
  try {
    // 1. Validation des données entrantes
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        message: "Erreur de validation", 
        details: error.details.map(err => err.message) 
      });
    }

    // 2. Vérification de l'existence de l'email
    const existingUser = await UserModel.findByEmail(value.email);
    if (existingUser) {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }

    // 3. Hash du mot de passe
    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(value.password, salt);

    // 4. Création de l'utilisateur
    const newId = await UserModel.create({
      ...value,
      password_hash
    });

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: newId,
        email: value.email,
        first_name: value.first_name,
        last_name: value.last_name,
        role: value.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la création du compte" });
  }
};

exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      console.log('Joi Error:', error.details);
      return res.status(400).json({ message: "Email ou mot de passe invalide", details: error.details });
    }

    // 1. Chercher l'utilisateur
    const user = await UserModel.findByEmail(value.email);
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // 2. Vérifier le mot de passe
    const isMatch = await bcrypt.compare(value.password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // 3. Générer le token JWT
    const payload = {
      id: user.id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
};
