import { Bell, Check, CheckCheck } from 'lucide-react';
import { useNotifications } from '@shared/hooks/useNotifications';
import { useMarkNotificationRead } from '@shared/hooks/sruseMarkNotificationRead';
import { useMarkAllNotificationsRead } from '@shared/hooks/useMarkAllNotificationsRead';
import { formatDateTime } from '@shared/lib/utils';
import type { Notification } from '@shared/types';

export function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  function handleMarkAll() {
    markAllRead.mutate(undefined, {
      onError: (err: unknown) => {
        const error = err as { message?: string };
        console.error('Failed to mark all as read:', error?.message);
      },
    });
  }

  return (
    <div className="flex flex-col" style={{ gap: '24px' }}>
      <div className="flex items-center justify-between flex-wrap" style={{ gap: '12px' }}>
        <div>
          <h2 className="font-sans font-bold text-ink" style={{ fontSize: '24px' }}>Notifications</h2>
          <p className="text-body2 text-ink-muted mt-1">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAll}
            disabled={markAllRead.isPending}
            className="rounded-pill border border-line-strong text-ink-secondary hover:text-ink hover:border-ink flex items-center transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{ height: '36px', padding: '0 14px', gap: '6px' }}
          >
            <CheckCheck className="w-4 h-4" />
            <span className="text-body2">Mark all as read</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-card-sm border border-line-strong animate-pulse bg-line" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-card-sm border border-dashed border-line-strong bg-white p-12 text-center">
          <Bell className="w-12 h-12 text-ink-muted mx-auto mb-3" />
          <h3 className="font-sans font-semibold text-ink mb-1">No notifications yet</h3>
          <p className="text-body2 text-ink-muted">
            We'll let you know when your order status changes or new products arrive.
          </p>
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: '12px' }}>
          {notifications.map((n) => (
            <NotificationRow
              key={n._id}
              notification={n}
              onMarkRead={() => markRead.mutate({ notificationId: n._id })}
              isMarking={markRead.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationRow({
  notification,
  onMarkRead,
  isMarking,
}: {
  notification: Notification;
  onMarkRead: () => void;
  isMarking: boolean;
}) {
  return (
    <div className={`rounded-card-sm border bg-white p-4 flex items-start transition-colors ${
      notification.is_read ? 'border-line-strong' : 'border-brand bg-primary-light/20'
    }`} style={{ gap: '12px' }}>
      <div className={`rounded-full w-10 h-10 flex items-center justify-center shrink-0 ${
        notification.is_read ? 'bg-line text-ink-muted' : 'bg-brand text-white'
      }`}>
        <Bell className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center" style={{ gap: '8px' }}>
          <span className="text-body1 font-semibold text-ink">{notification.title}</span>
          {!notification.is_read && (
            <span className="rounded-full bg-brand text-white text-body3 px-2 py-0.5">New</span>
          )}
        </div>
        <p className="text-body2 text-ink-secondary mt-1">{notification.content}</p>
        <p className="text-body3 text-ink-muted mt-2">{formatDateTime(notification.createdAt)}</p>
      </div>

      {!notification.is_read && (
        <button
          type="button"
          onClick={onMarkRead}
          disabled={isMarking}
          aria-label="Mark as read"
          title="Mark as read"
          className="text-ink-muted hover:text-success transition-colors disabled:cursor-not-allowed disabled:opacity-50 shrink-0"
        >
          <Check className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}