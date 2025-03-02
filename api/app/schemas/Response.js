const ResponsesSchema = {
  id: 'guid',
  incidentId: 'guid',
  resources: [
    {
      resourceId: 'guid',
      arrived: 'bool', // have they arrived?
      enRoute: 'bool', // have they left?
      eta: 'int', // in seconds
    },
  ], // List of resourceIds with information about their responses
  requestLocation: {
    address: 'string',
    coordinates: {
      latitude: 'number',
      longitude: 'number',
    },
  },
  requestedAt: 'timestamp',
  completed: 'bool', // is the response done?
  notified: 'bool', // have the resources been notified?
}

module.exports = ResponsesSchema
