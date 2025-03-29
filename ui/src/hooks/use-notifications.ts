import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/context'
import { useMqtt } from '@/context/mqtt-provider'
import { Notification } from '@/types'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()
  const { incidents, connectionStatus } = useMqtt()

  useEffect(() => {
    if (!user || connectionStatus !== 'connected') return

    try {
      const notificationsList = Object.values(incidents)
        .map(
          incident =>
            ({
              id: `notification-${incident.id}`,
              uid: user.uid,
              title: `Incident ${incident.status}`,
              message: `${incident.type} at ${incident.address}`,
              read: false,
              start_time: incident.lastUpdatedAt.getTime(),
              type: 'incident_update',
            }) as Notification,
        )
        .sort((a, b) => b.start_time - a.start_time)
        .slice(0, 10)

      setNotifications(notificationsList)
    } catch (error) {
      toast.error('Failed to process notifications')
      console.error(error)
    }
  }, [incidents, user, connectionStatus])

  return notifications
}
