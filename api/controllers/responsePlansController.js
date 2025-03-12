const CosmosDB = require('../app/database/database-singleton')

exports.getResponsePlans = async (req, res) => {
  try {
    const service = await CosmosDB.getInstance()
    const responsePlans = await service.queryItems('SELECT * from c', 'responsePlans')
    res.json(responsePlans)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
