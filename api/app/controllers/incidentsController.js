const CosmosDB = require('../database/database-singleton')

exports.getIncidents = async (req, res) => {
  try {
    const service = await CosmosDB.getInstance()
    const incidents = await service.queryItems('SELECT * FROM c', 'incidents')
    res.json(incidents)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getIncidentById = async (req, res) => {
  try {
    const { id } = req.params
    const service = await CosmosDB.getInstance()
    const incidents = await service.queryItems(`SELECT * FROM c WHERE c.id = '${id}'`, 'incidents')

    if (incidents.length === 0) {
      return res.status(404).json({ message: 'Incident not found' })
    }
    res.json(incidents[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createIncident = async (req, res) => {
  try {
    const service = await CosmosDB.getInstance()
    const newIncident = await service.addItem(req.body, 'incidents')
    res.status(201).json(newIncident)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateIncident = async (req, res) => {
  try {
    const { id } = req.params
    const service = await CosmosDB.getInstance()
    const updatedIncident = await service.updateItem(id, req.body, 'incidents')
    res.json(updatedIncident)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deleteIncident = async (req, res) => {
  try {
    const { id } = req.params
    const service = await CosmosDB.getInstance()
    await service.deleteItem(id, id, 'incidents')
    res.json({ message: 'Incedent deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
