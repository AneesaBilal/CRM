import React from 'react';
import { useTable } from '../lib/useTable';
import { Button, Card, Empty, ErrorPanel, PageHeader, Spinner, cn } from '../components/ui';

export default function Notifications() {
  const table = useTable('nexacrm_notifications');

  async function markRead(notification: any) {
    try {
      await table.update(notification.id, { read: true });
    } catch (err: any) {
      window.alert(err.message || 'Failed to update notification.');
    }
  }

  async function markAllRead() {
    const unread = table.rows.filter(function (n: any) { return !n.read; });
    for (const notification of unread) {
      try {
        await table.update(notification.id, { read: true });
      } catch (err) {
        // continue
      }
    }
  }

  async function deleteNotification(notification: any) {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await table.remove(notification.id);
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete notification.');
    }
  }

  if (table.loading) return <Spinner label="Loading notifications..." />;
  if (table.error) return <ErrorPanel error={table.error} />;

  const unreadCount = table.rows.filter(function (n: any) { return !n.read; }).length;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        subtitle={unreadCount + ' unread'}
        action={<Button variant="secondary" onClick={markAllRead}>Mark all read</Button>}
      />

      <Card>
        {table.rows.length === 0 ? (
          <Empty title="You're all caught up." />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {table.rows.map(function (notification: any) {
              return (
                <div key={notification.id} className={cn('flex items-start gap-3 px-5 py-4', !notification.read && 'bg-indigo-50/50 dark:bg-indigo-500/5')}>
                  <div className="min-w-0 flex-1">
                    <p className={notification.read ? 'text-sm text-slate-600 dark:text-slate-300' : 'text-sm font-medium text-slate-800 dark:text-slate-100'}>
                      {notification.body}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{new Date(notification.created_at).toLocaleString()}</p>
                  </div>
                  {!notification.read ? (
                    <Button variant="secondary" onClick={function () { markRead(notification); }}>Mark read</Button>
                  ) : null}
                  <Button variant="danger" onClick={function () { deleteNotification(notification); }}>Delete</Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
