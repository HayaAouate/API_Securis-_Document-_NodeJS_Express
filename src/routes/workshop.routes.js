const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshop.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/workshops:
 *   get:
 *     summary: Liste des ateliers (avec pagination et filtres)
 *     tags: [Workshops]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste récupérée
 */
router.get('/', workshopController.getAll);

/**
 * @swagger
 * /api/workshops/{id}/participants:
 *   get:
 *     summary: Liste des inscrits à un atelier (Propriétaire uniquement)
 *     tags: [Workshops]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des participants
 *       403:
 *         description: Non autorisé
 */
router.get('/:id/participants', requireAuth, requireRole('trainer'), workshopController.getParticipants);

module.exports = router;
