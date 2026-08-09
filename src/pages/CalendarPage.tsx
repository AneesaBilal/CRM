import React, { useMemo, useState } from 'react';
import { useTable } from '../lib/useTable';
import { Button, Card, ErrorPanel, PageHeader, Spinner, cn } from '../components/ui';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const activities = useTable('nexacrm_activities');
  const tasks = useTable('nexacrm_tasks');
  const [cursor, setCursor] = useState(function () {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const loading = activities.loading || tasks.loading;
  const error = activities.error || tasks.error;

  const byDay = useMemo(function () {
    const map: Record<string, any[]> = {};

    activities.rows.forEach(function (a: any) {
      const iso = a.scheduled_at || a.created_at;
      const key = iso.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push({ title: a.subject, kind: a.type });
    });

    tasks.rows.forEach(function (t: any) {
      if (!t.due_date || t.status === 'Completed') return;
      const key = t.due_date.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push({ title: t.title, kind: 'Task' });
    });

    return map;
  }, [activities.rows, tasks.rows]);

  const cells = useMemo(function () {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr: any[] = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    return arr;
  }, [cursor]);

  const monthLabel = cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const todayKey = new Date().toISOString().slice(0, 10);

  if (loading) return <Spinner label="Loading calendar..." />;
  if (error) return <ErrorPanel error={error} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Calendar"
        subtitle="Scheduled activities and due tasks."
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={function () { setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)); }}>Prev</Button>
            <span className="min-w-[140px] text-center text-sm font-semibold">{monthLabel}</span>
            <Button variant="secondary" onClick={function () { setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)); }}>Next</Button>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800">
          {WEEKDAYS.map(function (d) {
            return <div key={d} className="px-2 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">{d}</div>;
          })}
        </div>
        <div className="grid grid-cols-7">
          {cells.map(function (cell, i) {
            if (!cell) {
              return <div key={'empty' + i} className="min-h-[96px] border-b border-r border-slate-100 bg-slate-50/50 dark:border-slate-800/60 dark:bg-slate-900/40"></div>;
            }

            const key = cell.toISOString().slice(0, 10);
            const dayEvents = byDay[key] || [];
            const isToday = key === todayKey;

            return (
              <div key={key} className={cn('min-h-[96px] border-b border-r border-slate-100 p-1.5 dark:border-slate-800/60', isToday && 'bg-indigo-50 dark:bg-indigo-500/10')}>
                <span className={cn('mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium', isToday ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300')}>
                  {cell.getDate()}
                </span>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(function (e, idx) {
                    return (
                      <div key={idx} className="truncate rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                        {e.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 ? <div className="text-[10px] text-slate-400">+{dayEvents.length - 3} more</div> : null}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
