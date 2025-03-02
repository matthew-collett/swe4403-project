const Constants = require('./Constants')

const ResponsePlansSchema = {
  id: 'guid',
  incidentType: Constants.IncidentType, // Enum
  severity: Constants.Severity, // Enum
  name: 'string',
  description: 'string',
  requiredResources: [
    {
      resourceType: 'enum',
      quantity: 'int',
    },
  ],
}

module.exports = ResponsePlansSchema
