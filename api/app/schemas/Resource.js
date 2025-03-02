const Constants = require('./Constants')

const ResourceSchema = {
  id: 'guid',
  type: Constants.ResourceType,
  category: Constants.ResourceCategory,
  status: Constants.Status,
  averageSpeed: 'int', // Average speed in km per hour for calculating ETA
  currentLocation: {
    address: 'string',
    coordinates: {
      latitude: 'number',
      longitude: 'number',
    },
  },
  isAssigned: 'bool',
  incidentId: 'guid', // incidentId if isAssigned = true, or null if not assigned
  capabilities: ['string'],
  lastUpdatedAt: 'timestamp',
}

module.exports = ResourceSchema
