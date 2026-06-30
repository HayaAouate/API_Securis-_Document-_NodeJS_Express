const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registration.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/registrations/{id}/cancel:
 *   patch:
 *     summary: Annuler une inscription (Apprenant propriétaire uniquement)
 *     tags: [Registrations]
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
 *         description: Inscription annulée
 *       403:
 *         description: Non autorisé
 */
router.patch('/:id/cancel', requireAuth, registrationController.cancel);

module.exports = router;
