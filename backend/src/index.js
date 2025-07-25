require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');
const forecastRoutes = require('./routes/forecast.routes');
const configurationRoutes = require('./routes/configuration.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.use('/api/auth', authRoutes);
app.use('/api/files', uploadRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/config', configurationRoutes);
app.use('/api/admin', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
