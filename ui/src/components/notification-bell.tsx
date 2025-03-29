import { Bell } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { NotificationModal } from '@/components'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui'
import { useNotifications } from '@/hooks'
import { Notification } from '@/types'

export const NotificationBell = () => {
  const notifications = useNotifications()
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

  const markNotificationAsRead = (notificationId: string) => {
    notifications.forEach(n => {
      if (n.id === notificationId) {
        n.read = true
      }
    })
  }

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification)
    try {
      if (!notification.read) {
        console.log(notification.id)
        markNotificationAsRead(notification.id)
      }
    } catch (error) {
      toast.error('error loading notifications')
      console.error(error)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" size="icon" className="relative text-primary">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            {notifications.some(n => !n.read) && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {notifications.filter(n => !n.read).length}
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
