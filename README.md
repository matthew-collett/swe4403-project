<p align="center">
  <h1 align="center">Unity Response - Event-Driven Emergency Management System</h1>
  <p align="center">
    <img src="ui/src/assets/icon.svg" width="200px"/>
  </p>
  
  <p align="center">Unity Response is an event-driven emergency management system designed to coordinate disaster response through real-time incident tracking, resource allocation, and notifications.</p>
</p>

## Project Overview

This project implements an event-driven architecture for emergency response coordination, allowing for:

- Real-time incident reporting and status updates
- Automated resource allocation based on incident type and severity
- Event-based communication between system components
- Responsive UI for emergency response personnel

## System Components

The system consists of:

1. **API Server**: Flask-based backend with CosmosDB integration
2. **Resource Allocator Service**: Microservice that handles automated resource allocation
3. **Web UI**: React-based frontend for user interaction

## Design Patterns

This project implements several key design patterns:

- **Singleton Pattern**: Used for database connections and service instances
- **Factory Pattern**: Creates strategies and incident objects dynamically
- **Strategy Pattern**: Different allocation strategies based on incident types
- **Observer Pattern**: Event-driven communication through MQTT

For detailed pattern implementation, see [patterns.md](./docs/patterns.md).

## Architecture

The system follows an event-driven architecture with loosely coupled components communicating through an MQTT message broker. For detailed architecture information, see [architecture.md](./docs/architecture.md).

## Running the Project

**Note:** Running this project locally requires configuration of Firebase, CosmosDB, and MQTT settings. It would probably be easiest if you view the deployed version at:

[https://swe4403-87431.web.app](https://swe4403-87431.web.app)

### Local Setup

If you still want to set up locally:

1. Clone the repository
2. Set up environment variables for both API and UI
3. Create Firebase and CosmosDB accounts
4. Set up an MQTT broker (HiveMQ)

#### API Setup

```bash
cd api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### UI Setup

```bash
cd ui
nvm use  # Make sure you have the correct Node.js version
yarn install
```

### Running with Make

The project includes a Makefile for easier execution:

```bash
# Set up dependencies for both API and UI
make setup

# Run the API server
make api

# Run the UI development server
make ui
```
