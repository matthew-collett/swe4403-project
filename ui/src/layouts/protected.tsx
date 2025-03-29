import { Navigate, Outlet } from 'react-router-dom'

import { LoadingScreen } from '@/components'
import { MqttProvider, useAuth, useMqtt } from '@/context'

const ReadIncidents = () => {
  useMqtt()
  return null
}

export const Protected = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <MqttProvider>
      <ReadIncidents />
      <Outlet />
    </MqttProvider>
  )
}
