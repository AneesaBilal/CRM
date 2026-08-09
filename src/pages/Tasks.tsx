import React, { useState } from 'react';
import { useTable } from '../lib/useTable';
import { Badge, Button, Card, Empty, ErrorPanel, Input, Label, Modal, PageHeader, Select, Spinner } from '../components/ui';

const emptyForm = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'To Do',
  due_date: ''
};

export default function Tasks() {
  const table = useTable('nexacrm_tasks');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  function setField(field: string, value: any) {
    setForm(function (prev) {
      const next = Object.assign({}, prev);
      next[field] = value;
      return next;
    });
  }

  async function save() {
    setMessage('');

    if (!form.title.trim()) {
      setMessage('Task title is required.');
      return;
    }

    setSaving(true);
    try {
      await table.create({
        title: form.title.trim(),
        description: form.description.trim() || null,
        priority: form.priority,
        status: form.status,
        due_date: form.due_date || null
      });

      setOpen(false);
      setForm(emptyForm);
    } catch (err: any) {
      setMessage(err.message || 'Failed to create task.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(task: any) {
    const nextStatus = task.status === 'Completed' ? 'To Do' : 'Completed';

    try {
      await table.update(task.id, { status: nextStatus });
    } catch (err: any) {
      window.alert(err.message || 'Failed to update task.');
    }
  }

  async function deleteTask(task: any) {
    if (!window.confirm('Delete task ' + task.title + '?')) return;

    try {
      await table.remove(task.id);
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete task.');
    }
  }

  if (table.loading) return <Spinner label="Loading tasks..." />;
  if (table.error) return <ErrorPanel error={table.error} />;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Tasks"
        subtitle="Managed in Supabase table nexacrm_tasks."
        action={<Button onClick={function () { setOpen(true); }}>Add Task</Button>}
      />

      <Card>
        {table.rows.length === 0 ? (
          <Empty title="No tasks found." />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {table.rows.map(function (task: any) {
              return (
                <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'Completed'}
                    onChange={function () { toggleTask(task); }}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />

                  <div className="min-w-0 flex-1">
                    <div className={task.status === 'Completed' ? 'text-sm font-medium text-slate-400 line-through' : 'text-sm font-medium text-slate-800 dark:text-slate-200'}>
                      {task.title}
                    </div>
                    {task.description ? <div className="truncate text-xs text-slate-400">{task.description}</div> : null}
                  </div>

                  <Badge>{task.priority}</Badge>
                  <Badge>{task.status}</Badge>
                  <div className="hidden w-28 text-xs text-slate-400 sm:block">{task.due_date || 'No due date'}</div>

                  <Button variant="danger" onClick={function () { deleteTask(task); }}>Delete</Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={function () { setOpen(false); }}
        title="Add Task"
        footer={
          <React.Fragment>
            <Button variant="secondary" onClick={function () { setOpen(false); }}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Create task'}</Button>
          </React.Fragment>
        }
      >
        {message ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{message}</div> : null}

        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={function (e: any) { setField('title', e.target.value); }} placeholder="Follow up with client" />
          </div>

          <div>
            <Label>Description</Label>
            <Input value={form.description} onChange={function (e: any) { setField('description', e.target.value); }} placeholder="Optional details" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onChange={function (e: any) { setField('priority', e.target.value); }}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={form.status} onChange={function (e: any) { setField('status', e.target.value); }}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </Select>
            </div>

            <div>
              <Label>Due date</Label>
              <Input type="date" value={form.due_date} onChange={function (e: any) { setField('due_date', e.target.value); }} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
