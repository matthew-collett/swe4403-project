require('dotenv').config()
const express = require('express')
const cors = require('cors')

const incidentsRoutes = require('./app/routes/incidents')
const resourcesRoutes = require('./app/routes/resources')
const responsePlansRoutes = require('./app/routes/responsePlans')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/incidents', incidentsRoutes)
app.use('/api/resources', resourcesRoutes)
app.use('/api/response-plans', responsePlansRoutes)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Runnin on port ${port}`))
