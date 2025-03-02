const { CosmosClient } = require('@azure/cosmos')

class CosmosDBService {
  static instance = null
  static cosmosClient = null
  static database = null
  static containers = {}

  constructor() {
    throw new Error('Use CosmosDBService.getInstance()')
  }

  static async getInstance() {
    if (!this.instance) {
      this.instance = new CosmosDBService()
      await this.initializeCosmosClient()
    }
    return this.instance
  }

  static async initializeCosmosClient() {
    const endpoint = 'your-cosmos-db-endpoint'
    const key = 'your-cosmos-db-key'
    const databaseId = 'your-database-id'

    // Create a new instance of the Cosmos client
    this.cosmosClient = new CosmosClient({ endpoint, key })

    // Get the database (creates if does not exist)
    const { database } = await this.cosmosClient.databases.createIfNotExists({ id: databaseId })
    this.database = database

    // Initialize containers as needed
    await this.initializeContainers(['container1', 'container2']) // Add your container IDs here
  }

  static async initializeContainers(containerIds) {
    for (const id of containerIds) {
      const { container } = await this.database.containers.createIfNotExists({ id })
      this.containers[id] = container
    }
  }

  async queryItems(query, containerId) {
    // Ensure the container exists
    if (!CosmosDBService.containers[containerId]) {
      throw new Error(`Container ${containerId} does not exist or has not been initialized.`)
    }

    const container = CosmosDBService.containers[containerId]
    const { resources: items } = await container.items.query(query).fetchAll()
    return items
  }

  async addItem(item, containerId) {
    if (!CosmosDBService.containers[containerId]) {
      throw new Error(`Container ${containerId} does not exist or has not been initialized.`)
    }

    const container = CosmosDBService.containers[containerId]
    const { resource: addedItem } = await container.items.create(item)
    return addedItem
  }

  async updateItem(itemId, newItem, containerId) {
    if (!CosmosDBService.containers[containerId]) {
      throw new Error(`Container ${containerId} does not exist or has not been initialized.`)
    }
    const container = CosmosDBService.containers[containerId]
    const { resource: updatedItem } = await container
      .items(itemId, newItem.partitionKey)
      .replace(newItem)
    return updatedItem
  }

  async deleteItem(itemId, partitionKey, containerId) {
    if (!CosmosDBService.containers[containerId]) {
      throw new Error(`Container ${containerId} does not exist or has not been initialized.`)
    }
    const container = CosmosDBService.containers[containerId]
    await container.items(itemId, partitionKey).delete()
  }
}

module.exports = CosmosDBService
