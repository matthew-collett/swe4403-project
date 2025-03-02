const Constants = require('./Constants')

const IncidentSchema = {
  id: 'guid',
  type: Constants.IncidentType,
  severity: Constants.Severity,
  status: Constants.Status,
  location: {
    address: 'string',
    coordinates: {
      latitude: 'number',
      longitude: 'number',
    },
  },
  description: 'string',
  reportedAt: 'timestamp',
  lastUpdatedAt: 'timestamp',
  tags: ['string'],
}

module.exports = IncidentSchema
