import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/context'
import { useMqtt } from '@/context/mqtt-provider'
import { Notification } from '@/types'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()
  const { incidents, connectionStatus } = useMqtt()

  const [readIds, setReadIds] = useState<string[]>(() => {
    if (typeof window === 'undefined' || !user) return []

    const stored = localStorage.getItem(`notification-read-${user.uid}`)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    if (!user) return
    localStorage.setItem(`notification-read-${user.uid}`, JSON.stringify(readIds))
  }, [readIds, user])

  useEffect(() => {
    if (!user || connectionStatus !== 'connected') return

    try {
      const notificationsList = Object.values(incidents)
        .map(incident => {
          const notifId = `notification-${incident.id}`

          return {
            id: notifId,
            uid: user.uid,
            title: `Incident ${incident.status}`,
            message: `${incident.type} at ${incident.address}`,
            read: readIds.includes(notifId),
            start_time: new Date(incident.lastUpdatedAt).getTime(),
            type: 'incident_update',
          } as Notification
        })
        .sort((a, b) => b.start_time - a.start_time)
        .slice(0, 10)

      setNotifications(notificationsList)
    } catch (error) {
      toast.error('Failed to process notifications')
      console.error(error)
    }
  }, [incidents, user, connectionStatus, readIds])

  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      setReadIds(prev => [...prev, id])
    }
  }

  return { notifications, markAsRead }
}
