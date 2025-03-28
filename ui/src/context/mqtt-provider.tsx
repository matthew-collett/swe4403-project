import mqtt, { MqttClient } from 'mqtt'
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from 'react'

import { useAuth } from '@/context/auth-provider'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface MqttContextType {
  // eslint-disable-next-line no-unused-vars
  publish: (message: string) => void
  connectionStatus: ConnectionStatus
}

const MqttContext = createContext<MqttContextType | null>(null)

export const MqttProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [client, setClient] = useState<MqttClient | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const { user } = useAuth()

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
  }, [user])

  const publish = useCallback(
    (message: string) => {
      client!.publish(`disasters/${user!.uid}`, message)
    },
    [client, user],
  )

  const contextValue: MqttContextType = {
    publish,
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
