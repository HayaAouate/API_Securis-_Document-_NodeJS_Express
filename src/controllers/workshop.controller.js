const WorkshopModel = require('../models/workshop.model');

exports.getAll = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const workshops = await WorkshopModel.findAll({ category, limit, offset });
    res.status(200).json(workshops);
  } catch (err) {
    console.error('Erreur get workshops:', err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getParticipants = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const workshop = await WorkshopModel.findById(workshopId);

    if (!workshop) {
      return res.status(404).json({ message: "Atelier introuvable" });
    }

    if (workshop.trainer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas le formateur de cet atelier." });
    }

    const participants = await WorkshopModel.getParticipants(workshopId);
    res.status(200).json(participants);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
