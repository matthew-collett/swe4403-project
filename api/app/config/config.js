const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    cosmos_endpoint: process.env.COSMOS_ENDPOINT || 'dev_cosmos_uri',
    cosmos_key: process.env.COSMOS_KEY || 'dev_cosmos_key',
    cosmos_db_id: process.env.COSMOS_DB_ID || 'dev_cosmos_id',
  },
}
