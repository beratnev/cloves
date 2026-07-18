import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotificationType = 'order' | 'wishlist' | 'promotion' | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  icon?: string
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notification-${Date.now()}`,
          timestamp: new Date(),
          read: false,
        }

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      },

      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id)
          if (!notification || notification.read) return state

          return {
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }
        })
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }))
      },

      removeNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id)
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: notification && !notification.read
              ? Math.max(0, state.unreadCount - 1)
              : state.unreadCount,
          }
        })
      },

      clearNotifications: () => {
        set(() => ({
          notifications: [],
          unreadCount: 0,
        }))
      },
    }),
    {
      name: 'notification-storage',
    }
  )
)

// Helper functions to create specific notification types
export function createOrderNotification(
  orderId: string,
  status: string,
  message: string
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  return {
    type: 'order',
    title: `Order ${orderId}`,
    message,
    actionUrl: `/profile?tab=orders`,
    actionLabel: 'View Order',
    icon: '📦',
  }
}

export function createWishlistNotification(
  productName: string,
  message: string
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  return {
    type: 'wishlist',
    title: 'Wishlist Update',
    message,
    actionUrl: '/profile?tab=wishlist',
    actionLabel: 'View Wishlist',
    icon: '❤️',
  }
}

export function createPromotionNotification(
  title: string,
  message: string,
  actionUrl?: string
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  return {
    type: 'promotion',
    title,
    message,
    actionUrl,
    actionLabel: actionUrl ? 'Shop Now' : undefined,
    icon: '🎉',
  }
}

export function createSystemNotification(
  title: string,
  message: string
): Omit<Notification, 'id' | 'timestamp' | 'read'> {
  return {
    type: 'system',
    title,
    message,
    icon: '🔔',
  }
}
