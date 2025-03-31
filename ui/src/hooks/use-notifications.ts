import { useEffect, useState, useCallback } from 'react'

import { useAuth } from '@/context'
import { useMqtt } from '@/context/mqtt-provider'
import { Notification } from '@/types'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()
  const { incidents, connectionStatus } = useMqtt()

  const [readIds, setReadIds] = useState<string[]>(() => {
    if (typeof window === 'undefined' || !user) return []
    const stored = localStorage.getItem(`notification-read-${user?.uid}`)
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    if (!user) return
    localStorage.setItem(`notification-read-${user.uid}`, JSON.stringify(readIds))
  }, [readIds, user])

  const refreshNotifications = useCallback(() => {
    if (!user || connectionStatus !== 'connected') return

    const notificationsList = Object.values(incidents)
      .map(incident => {
        // Include the status in the notification ID to make it unique per status change
        const notifId = `notification-${incident.id}-${incident.status}-${incident.lastUpdatedAt}`

        return {
          id: notifId,
          uid: user.uid,
          title: `Incident ${incident.status}`,
          message: `${incident.type} at ${incident.address}`,
          read: readIds.includes(notifId),
          start_time: new Date(incident.lastUpdatedAt).getTime(),
          type: 'incident_update',
          // Store the incident ID separately so you can link to the incident
          incidentId: incident.id,
        } as Notification
      })
      .sort((a, b) => b.start_time - a.start_time)
      .slice(0, 10)

    setNotifications(notificationsList)
  }, [incidents, user, connectionStatus, readIds])

  useEffect(() => {
    refreshNotifications()
  }, [incidents, refreshNotifications])

  const markAsRead = useCallback(
    (id: string) => {
      if (!readIds.includes(id)) {
        setReadIds(prev => [...prev, id])
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        )
      }
    },
    [readIds],
  )

  return {
    notifications,
    markAsRead,
    refreshNotifications,
  }
}
