const fs = require('fs');
const path = require('path');
const swaggerSpecs = require('./src/config/swagger');

const docsDir = path.join(__dirname, 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

fs.writeFileSync(
  path.join(docsDir, 'openapi.json'),
  JSON.stringify(swaggerSpecs, null, 2)
);

console.log('Fichier docs/openapi.json généré avec succès !');
