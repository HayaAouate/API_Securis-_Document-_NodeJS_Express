require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(cors());
app.use(express.json()); // Pour parser le body en JSON

// Documentation Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
// Route pour récupérer le openapi.json
app.get('/api/docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

// Déclaration des routes
const authRoutes = require('./routes/auth.routes');
const workshopRoutes = require('./routes/workshop.routes');
const registrationRoutes = require('./routes/registration.routes');

app.use('/api/auth', authRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/registrations', registrationRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API SkillHub fonctionnelle' });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Documentation Swagger sur http://localhost:${PORT}/api/docs`);
});
