require('dotenv').config();
const express = require('express');
const cors = require('cors');

const incidentsRoutes = require('./routes/incidents');
const resourcesRoutes = require('./routes/resources');
const responsePlansRoutes = require('./routes/responsePlans');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/incidents', incidentsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/response-plans', responsePlansRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Runnin on port ${5000}`));