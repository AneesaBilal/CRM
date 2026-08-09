import React, { useState } from 'react';
import { useTable } from '../lib/useTable';
import { Badge, Button, Card, Empty, ErrorPanel, Input, Label, Modal, PageHeader, Select, Spinner } from '../components/ui';

const statuses = ['Open', 'In Progress', 'Waiting', 'Resolved', 'Closed'];

export default function Tickets() {
  const tickets = useTable('nexacrm_tickets');
  const companies = useTable('nexacrm_companies');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: '', company_id: '', priority: 'Medium', category: 'Bug' });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loading = tickets.loading || companies.loading;
  const error = tickets.error || companies.error;

  function companyName(id: string) {
    const company = companies.rows.find(function (c: any) { return c.id === id; });
    return company ? company.name : '—';
  }

  async function save() {
    setMessage('');
    if (!form.subject.trim()) {
      setMessage('Subject is required.');
      return;
    }

    setSaving(true);
    try {
      await tickets.create({
        number: 'TCK-' + String(1044 + tickets.rows.length),
        subject: form.subject.trim(),
        company_id: form.company_id || null,
        priority: form.priority,
        status: 'Open',
        category: form.category,
        messages: []
      });
      setOpen(false);
      setForm({ subject: '', company_id: '', priority: 'Medium', category: 'Bug' });
    } catch (err: any) {
      setMessage(err.message || 'Failed to create ticket.');
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(ticket: any, status: string) {
    try {
      await tickets.update(ticket.id, { status: status });
    } catch (err: any) {
      window.alert(err.message || 'Failed to update ticket.');
    }
  }

  async function deleteTicket(ticket: any) {
    if (!window.confirm('Delete ticket ' + ticket.number + '?')) return;
    try {
      await tickets.remove(ticket.id);
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete ticket.');
    }
  }

  if (loading) return <Spinner label="Loading tickets..." />;
  if (error) return <ErrorPanel error={error} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Support Tickets"
        subtitle="Customer issues stored in nexacrm_tickets."
        action={<Button onClick={function () { setOpen(true); }}>New Ticket</Button>}
      />

      <Card>
        {tickets.rows.length === 0 ? (
          <Empty title="No tickets yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                  <th className="px-4 py-3 font-medium">Ticket</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tickets.rows.map(function (ticket: any) {
                  return (
                    <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{ticket.subject}</div>
                        <div className="font-mono text-xs text-slate-400">{ticket.number}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{companyName(ticket.company_id)}</td>
                      <td className="px-4 py-3"><Badge>{ticket.priority}</Badge></td>
                      <td className="px-4 py-3">
                        <Select value={ticket.status} onChange={function (e: any) { changeStatus(ticket, e.target.value); }} className="h-8 w-36 text-xs">
                          {statuses.map(function (s) {
                            return <option key={s}>{s}</option>;
                          })}
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{ticket.category || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="danger" onClick={function () { deleteTicket(ticket); }}>Delete</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={function () { setOpen(false); }}
        title="New Ticket"
        footer={
          <React.Fragment>
            <Button variant="secondary" onClick={function () { setOpen(false); }}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Create ticket'}</Button>
          </React.Fragment>
        }
      >
        {message ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{message}</div> : null}

        <div className="space-y-4">
          <div>
            <Label>Subject</Label>
            <Input value={form.subject} onChange={function (e: any) { setForm(Object.assign({}, form, { subject: e.target.value })); }} placeholder="Unable to export report" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label>Company</Label>
              <Select value={form.company_id} onChange={function (e: any) { setForm(Object.assign({}, form, { company_id: e.target.value })); }}>
                <option value="">No company</option>
                {companies.rows.map(function (company: any) {
                  return <option key={company.id} value={company.id}>{company.name}</option>;
                })}
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onChange={function (e: any) { setForm(Object.assign({}, form, { priority: e.target.value })); }}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </Select>
            </div>

            <div>
              <Label>Category</Label>
              <Select value={form.category} onChange={function (e: any) { setForm(Object.assign({}, form, { category: e.target.value })); }}>
                <option>Bug</option>
                <option>Billing</option>
                <option>Authentication</option>
                <option>Reporting</option>
                <option>Feature Request</option>
              </Select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
