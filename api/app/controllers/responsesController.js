const CosmosDB = require('../database/database-singleton')

exports.getResponses = async (req, res) => {
  try {
    const service = await CosmosDB.getInstance()
    const responses = await service.queryItems('SELECT * FROM c', 'Responses')
    res.json(responses)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getResponseById = async (req, res) => {
  try {
    const { id } = req.params
    const service = await CosmosDB.getInstance()
    const responses = await service.queryItems(`SELECT * FROM c WHERE c.id = '${id}'`, 'Responses')

    if (responses.length === 0) {
      return res.status(404).json({ message: 'Response not found' })
    }
    res.json(responses[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.createResponse = async (req, res) => {
  try {
    const service = await CosmosDB.getInstance()
    const newResponse = await service.addItem(req.body, 'responses')
    res.status(201).json(newResponse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateResponse = async (req, res) => {
  try {
    const { id } = req.params
    const service = await CosmosDB.getInstance()
    const updatedResponse = await service.updateItem(id, req.body, 'responses')
    res.json(updatedResponse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deleteResponse = async (req, res) => {
  try {
    const { id } = req.params
    const service = await CosmosDB.getInstance()
    await service.deleteItem(id, id, 'responses')
    res.json({ message: 'Response deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
