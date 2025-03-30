import { Bell } from 'lucide-react'
import { useState, useEffect } from 'react'

import { NotificationModal } from '@/components'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui'
import { useMqtt } from '@/context'
import { useNotifications } from '@/hooks'
import { Notification } from '@/types'

export const NotificationBell = () => {
  const { notifications, markAsRead, refreshNotifications } = useNotifications()
  const { connectionStatus } = useMqtt()
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  useEffect(() => {
    if (connectionStatus === 'connected') {
      refreshNotifications()
    }
  }, [connectionStatus, refreshNotifications])

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" size="icon" className="relative text-primary">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {unreadCount}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-popover text-popover-foreground border border-border shadow-lg"
        >
          {notifications.length === 0 ? (
            <DropdownMenuItem disabled className="text-muted-foreground">
              No notifications
            </DropdownMenuItem>
          ) : (
            notifications.map(n => (
              <DropdownMenuItem
                key={n.id}
                className={`flex flex-col items-start p-2 hover:bg-muted hover:text-muted-foreground cursor-pointer ${
                  n.read ? 'opacity-50' : ''
                }`}
                onClick={() => handleNotificationClick(n)}
              >
                <span className="font-medium">{n.title}</span>
                <span className="text-sm">{n.message}</span>
                <small className="text-muted-foreground">
                  {n.start_time ? new Date(n.start_time).toLocaleString() : 'No time available'}
                </small>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <NotificationModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </>
  )
}
