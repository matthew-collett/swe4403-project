const { CosmosClient } = require('@azure/cosmos')
const config = require('../config/config')

class CosmosDBService {
  static cosmosClient = null
  static database = null
  static containers = {}

  static async getInstance() {
    if (!this.cosmosClient) {
      await this.initializeCosmosClient()
    }
    return this
  }

  static async initializeCosmosClient() {
    const endpoint = config.db.cosmos_endpoint
    const key = config.db.cosmos_key
    const databaseId = config.db.cosmos_db_id

    this.cosmosClient = new CosmosClient({ endpoint, key })

    const { database } = await this.cosmosClient.databases.createIfNotExists({ id: databaseId })
    this.database = database

    await this.initializeContainers([
      'Incidents',
      'Locations',
      'Resources',
      'ResponsePlans',
      'Responses',
    ])
  }

  static async initializeContainers(containerIds) {
    for (const id of containerIds) {
      const { container } = await this.database.containers.createIfNotExists({ id })
      this.containers[id] = container
    }
  }

  static async queryItems(query, containerId) {
    if (!this.containers[containerId]) {
      throw new Error(`Container ${containerId} does not exist or has not been initialized.`)
    }

    const container = this.containers[containerId]
    const { resources: items } = await container.items.query(query).fetchAll()
    return items
  }

  static async addItem(item, containerId) {
    if (!this.containers[containerId]) {
      throw new Error(`Container ${containerId} does not exist or has not been initialized.`)
    }

    const container = this.containers[containerId]
    const { resource: addedItem } = await container.items.create(item)
    return addedItem
  }

  static async updateItem(itemId, newItem, containerId) {
    if (!this.containers[containerId]) {
      throw new Error(`Container ${containerId} does not exist or has not been initialized.`)
    }
    const container = this.containers[containerId]
    const { resource: updatedItem } = await container
      .item(itemId, newItem.partitionKey)
      .replace(newItem)
    return updatedItem
  }

  static async deleteItem(itemId, partitionKey, containerId) {
    if (!this.containers[containerId]) {
      throw new Error(`Container ${containerId} does not exist or has not been initialized.`)
    }
    const container = this.containers[containerId]
    await container.item(itemId, partitionKey).delete()
  }
}

module.exports = CosmosDBService
