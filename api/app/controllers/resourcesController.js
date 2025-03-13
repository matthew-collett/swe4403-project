const CosmosDB = require('../database/database-singleton')

exports.getResources = async (req, res) => {
  try {
    const service = await CosmosDB.getInstance()
    const resources = await service.queryItems('SELECT * from c', 'Resources')
    res.json(resources)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createResource = async (req, res) => {
  try {
    const service = await CosmosDB.getInstance()
    const newResource = await service.addItem(req.body, 'Resources')
    res.status(201).json(newResource)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
