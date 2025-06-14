// Importem les llibreries necessàries
const express = require('express'); // Framework per crear el servidor web
const cors = require('cors'); // Middleware per permetre peticions des de diferents orígens (Cross-Origin Resource Sharing)
const dotenv = require('dotenv'); // Permet carregar variables d'entorn des d’un fitxer .env

// Importem les rutes definides per a cada entitat del sistema
const areaRoutes = require('./routes/areaRoutes');
const evaluacionRoutes = require('./routes/evaluacionRoutes');
const rolRoutes = require('./routes/rolRoutes');
const rubricaRoutes = require('./routes/rubricaRoutes');
const trabajoRoutes = require('./routes/trabajoRoutes');
const userRoutes = require('./routes/userRoutes');

// Carreguem les variables d'entorn (com DATABASE_URL, PORT, etc.)
dotenv.config();

// Inicialitzem l’aplicació Express
const app = express();

// Configurem CORS per permetre només peticions des del frontend allotjat a Netlify
app.use(cors({ origin: 'https://tfg-david-sanchez.netlify.app' }));

// Permetem que el servidor entengui peticions amb dades en format JSON
app.use(express.json());

// Ruta base per comprovar que el servidor funciona
app.get('/', (req, res) => {
  res.send('API de evaluación TFG funcionando ✅');
});

// Afegim les rutes de l’API, cada una gestiona un recurs diferent
app.use(areaRoutes);       // Rutes per gestionar les àrees
app.use(evaluacionRoutes); // Rutes per gestionar les avaluacions
app.use(rolRoutes);        // Rutes per gestionar els rols d’usuari
app.use(rubricaRoutes);    // Rutes per gestionar les rúbriques
app.use(trabajoRoutes);    // Rutes per gestionar els treballs
app.use(userRoutes);       // Rutes per gestionar els usuaris

// Iniciem el servidor en el port definit a la variable d’entorn o el 3000 per defecte
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escoltant a http://localhost:${PORT}`);
});
