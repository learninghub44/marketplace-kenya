import { supabaseAdmin } from './supabase'

export async function createNotification({
  user_id,
  type,
  title,
  message,
  data,
  tenant_id,
}: {
  user_id: string
  type: string
  title: string
  message: string
  data?: any
  tenant_id: string
}) {
  try {
    const { error } = await supabaseAdmin.from('notifications').insert({
      user_id,
      type,
      title,
      message,
      data,
      tenant_id,
    })

    if (error) {
      console.error('Failed to create notification:', error)
    }
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

export async function markNotificationAsRead(notificationId: string, userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to mark notification as read:', error)
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error)
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error)
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) {
      console.error('Failed to get unread count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Failed to get unread count:', error)
    return 0
  }
}
