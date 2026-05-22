const { supabaseAdmin } = require('../config/supabase');

const createNotification = async ({
  user_id,
  type,
  title,
  message,
  data,
  tenant_id,
}) => {
  try {
    const { error } = await supabaseAdmin.from('notifications').insert({
      user_id,
      type,
      title,
      message,
      data,
      tenant_id,
    });

    if (error) {
      console.error('Failed to create notification:', error);
    }
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to mark notification as read:', error);
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

const markAllNotificationsAsRead = async (userId) => {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
  }
};

const getUnreadCount = async (userId) => {
  try {
    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Failed to get unread count:', error);
    return 0;
  }
};

module.exports = {
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadCount,
};
