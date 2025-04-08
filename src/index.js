const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const areaRoutes = require('./routes/areaRoutes');
const evaluacionRoutes = require('./routes/evaluacionRoutes');
const rolRoutes = require('./routes/rolRoutes');
const rubricaRoutes = require('./routes/rubricaRoutes');
const trabajoRoutes = require('./routes/trabajoRoutes');
const userRoutes = require('./routes/userRoutes');

const authMiddleware = require('./middleware/authMiddleware');
const checkRole = require('./middleware/checkRole');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.get('/', (req, res) => {
  res.send('API de evaluación TFG funcionando ✅');
});

app.use(areaRoutes);
app.use(evaluacionRoutes);
app.use(rolRoutes);
app.use(rubricaRoutes);
app.use(trabajoRoutes);
app.use(userRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
