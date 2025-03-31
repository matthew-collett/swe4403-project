import mqtt, { MqttClient } from 'mqtt'
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'

import { useAuth } from '@/context/auth-provider'
import { auth } from '@/lib'
import { api } from '@/lib/api'
import { IncidentUpdate, Incident, StatusType } from '@/types'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface MqttContextType {
  // eslint-disable-next-line no-unused-vars
  createIncident: (incident: IncidentUpdate) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  updateIncidentStatus: (incidentId: string, status: StatusType) => Promise<boolean>
  incidents: Record<string, Incident>
  connectionStatus: ConnectionStatus
  refreshIncidents: () => Promise<void>
}

const MqttContext = createContext<MqttContextType | null>(null)

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<MqttClient | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [incidents, setIncidents] = useState<Record<string, Incident>>({})
  const { user } = useAuth()

  const refreshIncidents = useCallback(async () => {
    if (!user) return

    const token = await auth.currentUser?.getIdToken()
    const { status, data } = await api.get('/incidents', token)

    if (status === 200) {
      const incidentMap = (data as Incident[]).reduce(
        (acc, incident) => {
          acc[incident.id] = incident
          return acc
        },
        {} as Record<string, Incident>,
      )

      setIncidents(incidentMap)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    refreshIncidents()
  }, [user, refreshIncidents])

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

  const createIncident = useCallback(
    async (incident: IncidentUpdate): Promise<void> => {
      if (!client || !user) {
        return
      }

      client.publish('incidents/new', JSON.stringify(incident))
      await refreshIncidents()
    },
    [client, user, refreshIncidents],
  )

  const updateIncidentStatus = useCallback(
    async (incidentId: string, status: StatusType): Promise<boolean> => {
      if (!client || !user) {
        return false
      }

      try {
        const update: IncidentUpdate = {
          id: incidentId,
          status,
          updatedAt: new Date().toISOString(),
        }

        client.publish(`incidents/allocator/${incidentId}/status`, JSON.stringify(update))
        await refreshIncidents()
        return true
      } catch (error) {
        console.error('Error in updateIncidentStatus:', error)
        return false
      }
    },
    [client, user, refreshIncidents],
  )

  const contextValue = useMemo(
    () => ({
      createIncident,
      updateIncidentStatus,
      incidents,
      connectionStatus,
      refreshIncidents,
    }),
    [createIncident, updateIncidentStatus, incidents, connectionStatus, refreshIncidents],
  )

  return <MqttContext.Provider value={contextValue}>{children}</MqttContext.Provider>
}

export const useMqtt = () => {
  const context = useContext(MqttContext)
  if (!context) {
    throw new Error('useMqtt must be used within an MqttProvider')
  }
  return context
}
