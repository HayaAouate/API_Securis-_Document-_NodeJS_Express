const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification des utilisateurs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: formateur@skillhub.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *                 description: Minimum 8 caractères, 1 majuscule, 1 chiffre
 *               first_name:
 *                 type: string
 *                 example: Jean
 *               last_name:
 *                 type: string
 *                 example: Dupont
 *               role:
 *                 type: string
 *                 enum: [learner, trainer]
 *                 example: trainer
 *               bio:
 *                 type: string
 *                 example: Développeur fullstack depuis 10 ans
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Erreur de validation
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Se connecter à l'API
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: chloe@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne le token JWT
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Identifiants incorrects
 */
router.post('/login', authController.login);

module.exports = router;
