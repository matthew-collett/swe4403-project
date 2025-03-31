# Design Patterns Implementation

This document details the Gang of Four (GoF) design patterns implemented in the Unity Response system.

## Singleton Pattern

The Singleton pattern ensures a class has only one instance and provides a global point of access to it. This pattern is particularly useful for database connections, configuration managers, and other resources that need to be shared across the application.

### Implementation: CosmosDBService

```python
# api/app/services/database_singleton.py
class CosmosDBService:
    cosmos_client = None
    database = None
    containers = {}

    @classmethod
    def get_instance(cls):
        if cls.cosmos_client is None:
            cls.initialize_cosmos_client()
        return cls
```

The `CosmosDBService` class implements the Singleton pattern to ensure only one connection to the CosmosDB database exists throughout the application's lifetime. The `get_instance()` method returns the same instance every time, initializing it only once when first accessed.

**Benefits:**
- Prevents multiple database connections, reducing resource usage
- Provides a global access point for database operations
- Lazy initialization of the database connection

## Factory Pattern

The Factory pattern provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created. This pattern is used to create objects without exposing the instantiation logic.

### Implementation: StrategyFactory

```python
# services/allocator/factories/strategy_factory.py
class StrategyFactory:
    @staticmethod
    def create_strategy(incident_type: str):
        incident_type = incident_type.upper()

        strategies = {
            'FIRE': FireStrategy,
            'HAZMAT': HazmatStrategy,
            'INFRASTRUCTURE': InfrastructureStrategy,
            'MEDICAL': MedicalStrategy,
            'NATURAL_DISASTER': NaturalDisasterStrategy,
        }

        strategy = strategies.get(incident_type)
        return strategy if strategy else None
```

The `StrategyFactory` uses the Factory pattern to create the appropriate resource allocation strategy based on the incident type. It abstracts the instantiation logic away from the client code.

### Implementation: IncidentFactory

```python
# services/allocator/factories/incident_factory.py
class IncidentFactory:
    @staticmethod
    def create_incident(data):
        return Incident(
            incident_id=data.get('id'),
            incident_type=data.get('type'),
            severity=data.get('severity'),
            location=data.get('location'),
            description=data.get('description'),
            reported_at=data.get('reportedAt'),
            reported_by=data.get('reportedBy')
        )
```

The `IncidentFactory` creates incident objects from raw data, providing a clean way to instantiate complex objects.

**Benefits:**
- Decouples object creation from the client code
- Makes the system more extensible for new incident types
- Centralizes object creation logic

## Strategy Pattern

The Strategy pattern defines a family of algorithms, encapsulating each one, and making them interchangeable. This pattern lets the algorithm vary independently from clients that use it.

### Implementation: Allocation Strategies

```python
# services/allocator/strategies/allocation_strategy.py
class AllocationStrategy(ABC):
    """Base allocation strategy that contains common logic for all strategies"""

    def __init__(self, incident_type):
        """Initialize with the specific incident type resources"""
        self.required_resources = resource_requirements.get(incident_type, {})

    def allocate(self, resources, severity):
        """Allocate resources based on incident severity"""
        required = self.required_resources.get(severity.upper(), {})
        resources_to_allocate = self.check_resource_availability(
            required, resources)

        if not resources_to_allocate:
            return None

        # Extract resource IDs into a flat list for the API call
        all_resource_ids = []
        for resource_ids in resources_to_allocate.values():
            all_resource_ids.extend(resource_ids)

        return all_resource_ids
```

The Strategy pattern is implemented through the `AllocationStrategy` abstract base class and its concrete implementations for different incident types (FireStrategy, HazmatStrategy, etc.). Each strategy encapsulates the resource allocation logic specific to a particular incident type.

**Benefits:**
- Isolates allocation logic for different incident types
- Provides a consistent interface for resource allocation
- Makes it easy to add new allocation strategies
- Allows switching strategies at runtime

## Observer Pattern

The Observer pattern defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically. This pattern is fundamental to event-driven architectures.

### Implementation: MQTT-Based Event Communication (Allocator)

```python
# services/allocator/mqtt_handler.py
class MQTTHandler:
    def __init__(self, message_handler):
        self.message_handler = message_handler
        self.BROKER_HOST = os.getenv('MQTT_BROKER_HOST')
        self.BROKER_PORT = int(os.getenv('MQTT_BROKER_PORT'))
        self.MQTT_USERNAME = os.getenv('MQTT_USERNAME')
        self.MQTT_PASSWORD = os.getenv('MQTT_PASSWORD')
        self.client = None

    def on_connect(self, client, userdata, flags, rc, props):
        if rc == 0:
            client.subscribe("incidents/new")
            client.subscribe("incidents/allocator/+/status")
            print("Connected to HiveMQ")
        else:
            print(f"MQTT connection failed with code {rc}")

    def on_message(self, client, userdata, msg):
        try:
            topic = msg.topic
            payload = json.loads(msg.payload.decode("utf-8"))
            print(f"Message received on {topic}: {payload}")

            # Call the message handler
            if self.message_handler:
                self.message_handler(topic, payload)
            else:
                print("No message handler configured")

        except Exception as e:
            print(f"Error handling message: {e}")
```


### Implementation: MQTT-Based Event Communication (React Context)
```tsx
 useEffect(() => {
    if (!user) return

    setConnectionStatus('connecting')
    const clientId = 'clientId-' + Math.random().toString(16).substring(2, 8)
    const host = import.meta.env.VITE_MQTT_HOST as string
    const port = import.meta.env.VITE_MQTT_PORT as string
    const brokerUrl = `wss://${host}:${port}/mqtt`
    const qos = (Number(import.meta.env.VITE_MQTT_QOS) || 2) as 0 | 1 | 2

    const options = {
      username: import.meta.env.VITE_MQTT_USERNAME as string,
      password: import.meta.env.VITE_MQTT_PASSWORD as string,
      clientId,
      rejectUnauthorized: true,
      clean: true,
      keepalive: 5,
      reconnectPeriod: 500,
      connectTimeout: 10000,
      qos,
    }

    const mqttClient = mqtt.connect(brokerUrl, options)

    mqttClient.on('connect', () => {
      setConnectionStatus('connected')
      mqttClient.subscribe('incidents/ui/+/status', { qos })
      mqttClient.subscribe('incidents/new', { qos })
      refreshIncidents()
    })

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    mqttClient.on('message', async (_topic, _message) => {
      await refreshIncidents()
    })

    mqttClient.on('offline', () => {
      setConnectionStatus('disconnected')
    })

    setClient(mqttClient)

    return () => {
      mqttClient.end()
      setClient(null)
      setConnectionStatus('disconnected')
    }
  }, [user, refreshIncidents])
```

The Observer pattern is implemented through the MQTT messaging system. Components like the UI and allocator subscribe to specific topics and receive updates when events occur.

In the frontend, the `MqttProvider` component in `ui/src/context/mqtt-provider.tsx` implements the Observer pattern, allowing React components to subscribe to MQTT events and update the UI accordingly.

**Benefits:**
- Loosely couples system components
- Enables real-time updates across the system
- Provides a scalable communication mechanism
- Supports dynamic registration and removal of observers