# System Architecture

## Overview

Unity Response implements an event-driven architecture (EDA) for emergency incident management and resource allocation. This architecture enables real-time, responsive coordination of emergency services by treating changes in system state as events that trigger appropriate responses throughout the system.

## Architectural Pattern: Event-Driven Architecture

The primary architectural pattern employed in this system is Event-Driven Architecture. In this pattern, system components communicate through events. Components produce and consume events without necessarily being aware of each other, creating a loosely coupled system.

### Key Components of the EDA

1. **Event Producers**: Components that detect state changes and generate events
2. **Event Channels**: Communication channels for distributing events (MQTT in this case)
3. **Event Consumers**: Components that listen for and react to specific events
4. **Event Processors**: Components that transform or enrich events

## System Structure

THe below outlines the various componenets of our system.

### 1. API Server (Flask)

The API server is built with Flask and serves as a RESTful interface for clients to interact with the system. It handles:

- User authentication via Firebase
- CRUD operations for incidents, resources, and response plans
- Database operations through the CosmosDBService singleton

Key components:

- **Routes**: Handle HTTP requests and delegate to services
- **Middlewares**: Implement cross-cutting concerns like authentication
- **Services**: Provide business logic and data access

### 2. Resource Allocator Service

The Resource Allocator is a microservice responsible for automatically allocating resources to incidents based on their type and severity. It:

- Listens for new incident events
- Determines the appropriate resource allocation strategy
- Allocates available resources to incidents
- Updates incident statuses

Key components:

- **Factories**: Create incidents and allocation strategies
- **Strategies**: Implement resource allocation logic for different incident types
- **MQTT Handler**: Handles event-based communication

### 3. Web UI (React)

The React-based web UI provides the user interface for emergency responders to interact with the system. It:

- Displays real-time incident information
- Allows manual creation and management of incidents
- Shows resource allocation status
- Provides notifications of system events

Key components:

- **Context Providers**: Manage global state and provide access to events
- **Components**: Reusable UI elements
- **Routes**: Define application navigation
- **MQTT Client**: Subscribes to event notifications

### 4. MQTT Message Broker

The MQTT message broker (HiveMQ) serves as the event bus for the system, enabling:

- Asynchronous communication between components
- Topic-based event routing
- Reliable message delivery
- Scalable event distribution

## Event Flow

The event-driven nature of the system is exemplified by the following flow:

1. A new incident is reported through the UI
2. The API server creates the incident record and publishes a "new incident" event
3. The Resource Allocator service receives the event and applies the appropriate allocation strategy
4. Available resources are assigned to the incident
5. A "status update" event is published
6. The UI receives the status update event and updates the display

## Design Decisions

### 1. Event-Driven Communication

**Decision**: Use MQTT for event-based communication.

**Rationale**:

- Enables real-time updates across system components
- Provides loose coupling between services
- Supports scalability and resilience
- Allows for future expansion of services

### 2. Microservice Architecture

**Decision**: Implement the Resource Allocator as a standalone microservice.

**Rationale**:

- Allows independent deployment and scaling
- Enables specialized resource allocation logic
- Increases system resilience
- Supports future expansion of allocation strategies

### 3. Strategy Pattern for Resource Allocation

**Decision**: Use the Strategy pattern for resource allocation.

**Rationale**:

- Different incident types require different allocation approaches
- New allocation strategies can be added without modifying existing code
- Encapsulates allocation logic in distinct classes
- Simplifies testing of allocation algorithms

### 4. Factory Pattern for Object Creation

**Decision**: Use factories for creating incidents and strategies.

**Rationale**:

- Centralizes creation logic
- Simplifies client code
- Supports extension with new types
- Enhances testability

### 5. Singleton Pattern for Database Access

**Decision**: Use a singleton for database access.

**Rationale**:

- Ensures a single database connection
- Reduces resource usage
- Provides a global access point
- Supports lazy initialization

## Data Flow

1. **Incident Reporting**:

   - UI → API → Database → MQTT → Resource Allocator

2. **Resource Allocation**:

   - Resource Allocator → API → Database → MQTT → UI

3. **Status Updates**:
   - UI → MQTT → Resource Allocator → API → Database → MQTT → UI

## Scalability Considerations

The event-driven architecture supports scalability in several ways:

1. **Horizontal Scaling**: Multiple instances of services can subscribe to the same topics
2. **Service Independence**: Services can be deployed and scaled independently
3. **Asynchronous Processing**: Non-blocking event handling improves throughput
4. **Topic-Based Routing**: Efficient message delivery to interested consumers

## Security Aspects

1. **Authentication**: Firebase authentication for users
2. **Authorization**: Token-based middleware for API access
3. **Data Protection**: Secure database access through the singleton service
