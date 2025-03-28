from azure.cosmos import CosmosClient, PartitionKey
import os


class CosmosDBService:
    cosmos_client = None
    database = None
    containers = {}

    @classmethod
    def get_instance(cls):
        if cls.cosmos_client is None:
            cls.initialize_cosmos_client()
        return cls

    @classmethod
    def initialize_cosmos_client(cls):
        connection_string = os.getenv('COSMOS_CONNECTION_STRING')
        database_id = os.getenv('COSMOS_DB_ID')

        cls.cosmos_client = CosmosClient.from_connection_string(
            connection_string)
        cls.database = cls.cosmos_client.create_database_if_not_exists(
            id=database_id)

        cls.initialize_containers([
            'Incidents',
            'Locations',
            'Resources',
            'ResponsePlans',
            'Responses',
        ])

    @classmethod
    def initialize_containers(cls, container_ids):
        for container_id in container_ids:
            container = cls.database.create_container_if_not_exists(
                id=container_id,
                # Adjust if you use another partition key
                partition_key=PartitionKey(path="/id")
            )
            cls.containers[container_id] = container

    @classmethod
    def query_items(cls, query, container_id):
        if container_id not in cls.containers:
            raise Exception(
                f"Container {container_id} does not exist or has not been initialized.")

        container = cls.containers[container_id]
        items = list(container.query_items(
            query=query, enable_cross_partition_query=True))
        return items

    @classmethod
    def list_items(cls, field_name, value, container_id):
        if container_id not in cls.containers:
            raise Exception(
                f"Container {container_id} does not exist or has not been initialized.")

        container = cls.containers[container_id]

        query = f"SELECT * FROM c WHERE c.{field_name} = @value"
        parameters = [{"name": "@value", "value": value}]

        items = list(container.query_items(
            query=query,
            parameters=parameters,
            enable_cross_partition_query=True
        ))

        return items

    @classmethod
    def read_item(cls, item_id, partition_key, container_id):
        if container_id not in cls.containers:
            raise Exception(
                f"Container {container_id} does not exist or has not been initialized.")
        container = cls.containers[container_id]
        response = container.read_item(
            item=item_id, partition_key=partition_key)
        return response

    @classmethod
    def add_item(cls, item, container_id):
        if container_id not in cls.containers:
            raise Exception(
                f"Container {container_id} does not exist or has not been initialized.")

        container = cls.containers[container_id]
        added_item = container.create_item(body=item)
        return added_item

    @classmethod
    def update_item(cls, item_id, new_item, container_id):
        if container_id not in cls.containers:
            raise Exception(
                f"Container {container_id} does not exist or has not been initialized.")

        container = cls.containers[container_id]
        updated_item = container.replace_item(item=item_id, body=new_item)
        return updated_item

    @classmethod
    def delete_item(cls, item_id, partition_key, container_id):
        if container_id not in cls.containers:
            raise Exception(
                f"Container {container_id} does not exist or has not been initialized.")

        container = cls.containers[container_id]
        container.delete_item(item=item_id, partition_key=partition_key)
