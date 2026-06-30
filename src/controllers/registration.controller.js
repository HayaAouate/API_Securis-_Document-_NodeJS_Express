const RegistrationModel = require('../models/registration.model');

exports.cancel = async (req, res) => {
  try {
    const registrationId = req.params.id;
    const registration = await RegistrationModel.findById(registrationId);

    if (!registration) {
      return res.status(404).json({ message: "Inscription introuvable" });
    }

    if (registration.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé. Cette inscription ne vous appartient pas." });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({ message: "L'inscription est déjà annulée" });
    }

    await RegistrationModel.updateStatus(registrationId, 'cancelled');
    res.status(200).json({ message: "Inscription annulée avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
