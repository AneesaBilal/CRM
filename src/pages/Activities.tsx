import React, { useState } from 'react';
import { useTable } from '../lib/useTable';
import { Badge, Button, Card, Empty, ErrorPanel, Input, Label, Modal, PageHeader, Select, Spinner, Textarea } from '../components/ui';

const emptyForm = { type: 'Call', subject: '', description: '', scheduled_at: '' };

export default function Activities() {
  const table = useTable('nexacrm_activities');
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
    if (!form.subject.trim()) {
      setMessage('Subject is required.');
      return;
    }

    setSaving(true);
    try {
      await table.create({
        type: form.type,
        subject: form.subject.trim(),
        description: form.description.trim() || null,
        scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null
      });
      setOpen(false);
      setForm(emptyForm);
    } catch (err: any) {
      setMessage(err.message || 'Failed to log activity.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteActivity(activity: any) {
    if (!window.confirm('Delete activity ' + activity.subject + '?')) return;
    try {
      await table.remove(activity.id);
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete activity.');
    }
  }

  if (table.loading) return <Spinner label="Loading activities..." />;
  if (table.error) return <ErrorPanel error={table.error} />;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Activities"
        subtitle="Calls, emails, meetings, and notes from nexacrm_activities."
        action={<Button onClick={function () { setOpen(true); }}>Log Activity</Button>}
      />

      <Card>
        {table.rows.length === 0 ? (
          <Empty title="No activities logged yet." />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {table.rows.map(function (activity: any) {
              return (
                <div key={activity.id} className="flex items-start gap-3 px-5 py-4">
                  <Badge>{activity.type}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{activity.subject}</p>
                    {activity.description ? <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{activity.description}</p> : null}
                  </div>
                  <div className="text-xs text-slate-400">
                    {activity.scheduled_at ? new Date(activity.scheduled_at).toLocaleDateString() : new Date(activity.created_at).toLocaleDateString()}
                  </div>
                  <Button variant="danger" onClick={function () { deleteActivity(activity); }}>Delete</Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={function () { setOpen(false); }}
        title="Log Activity"
        footer={
          <React.Fragment>
            <Button variant="secondary" onClick={function () { setOpen(false); }}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Log activity'}</Button>
          </React.Fragment>
        }
      >
        {message ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{message}</div> : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Type</Label>
            <Select value={form.type} onChange={function (e: any) { setField('type', e.target.value); }}>
              <option>Call</option>
              <option>Email</option>
              <option>Meeting</option>
              <option>Note</option>
              <option>Follow-up</option>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={form.scheduled_at} onChange={function (e: any) { setField('scheduled_at', e.target.value); }} />
          </div>
        </div>

        <div className="mt-4">
          <Label>Subject</Label>
          <Input value={form.subject} onChange={function (e: any) { setField('subject', e.target.value); }} placeholder="Discovery call" />
        </div>

        <div className="mt-4">
          <Label>Description</Label>
          <Textarea rows={3} value={form.description} onChange={function (e: any) { setField('description', e.target.value); }} placeholder="Details..." />
        </div>
      </Modal>
    </div>
  );
}
