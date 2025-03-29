import mqtt, { MqttClient } from 'mqtt'
import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react'

import { useAuth } from '@/context/auth-provider'
import { auth } from '@/lib'
import { api } from '@/lib/api'
import { IncidentUpdate, Incident, StatusType } from '@/types'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface MqttContextType {
  // eslint-disable-next-line no-unused-vars
  createIncident: (incident: IncidentUpdate) => void
  // eslint-disable-next-line no-unused-vars
  updateIncidentStatus: (incidentId: string, status: StatusType) => void
  incidents: Record<string, Incident>
  connectionStatus: ConnectionStatus
}

const MqttContext = createContext<MqttContextType | null>(null)

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<MqttClient | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [incidents, setIncidents] = useState<Record<string, Incident>>({})
  const { user } = useAuth()

  const fetchIncident = useCallback(async (incidentId: string): Promise<Incident | null> => {
    const token = await auth.currentUser?.getIdToken()
    try {
      const { status, data } = await api.get(`/incidents/${incidentId}`, token)
      return status === 200 ? (data as Incident) : null
    } catch (error) {
      console.error(`Failed to fetch incident ${incidentId}:`, error)
      return null
    }
  }, [])

  useEffect(() => {
    if (!user) {
      return
    }

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
      console.log('Connected to MQTT broker')
      setConnectionStatus('connected')
      mqttClient.subscribe('incidents/+/status', { qos })
    })

    mqttClient.on('message', async (topic, message) => {
      try {
        const payload = JSON.parse(message.toString()) as IncidentUpdate
        console.log(`Received message on ${topic}: ${JSON.stringify(payload)}`)
        const incident = await fetchIncident(payload.id)
        if (incident) {
          setIncidents(prev => ({
            ...prev,
            [payload.id]: incident,
          }))
        }
      } catch (error) {
        console.error('Error processing MQTT message:', error)
      }
    })

    mqttClient.on('error', (err: Error) => {
      console.error('MQTT connection error:', err)
      setConnectionStatus('error')
    })

    mqttClient.on('offline', () => {
      console.log('MQTT client offline')
      setConnectionStatus('disconnected')
    })

    setClient(mqttClient)

    return () => {
      mqttClient.end()
      setClient(null)
      setConnectionStatus('disconnected')
    }
  }, [user, fetchIncident])

  const createIncident = useCallback(
    (incident: IncidentUpdate) => {
      if (!client || !user) return
      client.publish(`incidents/${incident.id}/status`, JSON.stringify(incident))
    },
    [client, user],
  )

  const updateIncidentStatus = useCallback(
    (incidentId: string, status: StatusType) => {
      if (!client || !user) return

      const update: IncidentUpdate = {
        id: incidentId,
        status,
        updatedAt: new Date().toISOString(),
      }

      client.publish(`incidents/${incidentId}/status`, JSON.stringify(update))
    },
    [client, user],
  )

  const contextValue: MqttContextType = {
    createIncident,
    updateIncidentStatus,
    incidents,
    connectionStatus,
  }

  return <MqttContext.Provider value={contextValue}>{children}</MqttContext.Provider>
}

export const useMqtt = () => {
  const context = useContext(MqttContext)
  if (!context) {
    throw new Error('useMqtt must be used within an MqttProvider')
  }
  return context
}
