import React, { useMemo, useState } from 'react';
import { useTable } from '../lib/useTable';
import { Badge, Button, Card, Empty, ErrorPanel, Input, Label, Modal, PageHeader, Select, Spinner, Textarea } from '../components/ui';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  source: 'Website',
  status: 'New',
  score: 'Warm',
  value: '',
  notes: ''
};

export default function Leads() {
  const table = useTable('nexacrm_leads');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(function () {
    const term = search.trim().toLowerCase();
    if (!term) return table.rows;

    return table.rows.filter(function (lead: any) {
      return [lead.name, lead.email, lead.company, lead.status, lead.source]
        .filter(Boolean)
        .some(function (value) {
          return String(value).toLowerCase().indexOf(term) >= 0;
        });
    });
  }, [table.rows, search]);

  function setField(field: string, value: any) {
    setForm(function (prev) {
      const next = Object.assign({}, prev);
      next[field] = value;
      return next;
    });
  }

  async function save() {
    setMessage('');

    if (!form.name.trim()) {
      setMessage('Lead name is required.');
      return;
    }

    setSaving(true);
    try {
      await table.create({
        name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        company: form.company.trim() || null,
        source: form.source,
        status: form.status,
        score: form.score,
        value: Number(form.value || 0),
        notes: form.notes.trim() || null
      });

      setOpen(false);
      setForm(emptyForm);
    } catch (err: any) {
      setMessage(err.message || 'Failed to create lead.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteLead(lead: any) {
    if (!window.confirm('Delete lead ' + lead.name + '?')) return;

    try {
      await table.remove(lead.id);
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete lead.');
    }
  }

  if (table.loading) return <Spinner label="Loading leads..." />;
  if (table.error) return <ErrorPanel error={table.error} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Leads"
        subtitle="Managed in Supabase table nexacrm_leads."
        action={<Button onClick={function () { setOpen(true); }}>Add Lead</Button>}
      />

      <Card>
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <Input
            value={search}
            onChange={function (e: any) { setSearch(e.target.value); }}
            placeholder="Search leads by name, company, email, status, or source..."
            className="max-w-md"
          />
        </div>

        {filtered.length === 0 ? (
          <Empty title="No leads found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                  <th className="px-4 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(function (lead: any) {
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{lead.name}</div>
                        {lead.title ? <div className="text-xs text-slate-400">{lead.title}</div> : null}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{lead.company || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{lead.email || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{lead.source || '—'}</td>
                      <td className="px-4 py-3"><Badge>{lead.status}</Badge></td>
                      <td className="px-4 py-3"><Badge>{lead.score || 'Warm'}</Badge></td>
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                        {Number(lead.value || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="danger" onClick={function () { deleteLead(lead); }}>Delete</Button>
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
        title="Add Lead"
        footer={
          <React.Fragment>
            <Button variant="secondary" onClick={function () { setOpen(false); }}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Create lead'}</Button>
          </React.Fragment>
        }
      >
        {message ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{message}</div> : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={function (e: any) { setField('name', e.target.value); }} placeholder="Sarah Ahmed" />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={function (e: any) { setField('email', e.target.value); }} placeholder="sarah@company.com" />
          </div>

          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={function (e: any) { setField('phone', e.target.value); }} placeholder="+1 555 000 0000" />
          </div>

          <div>
            <Label>Company</Label>
            <Input value={form.company} onChange={function (e: any) { setField('company', e.target.value); }} placeholder="Company name" />
          </div>

          <div>
            <Label>Source</Label>
            <Select value={form.source} onChange={function (e: any) { setField('source', e.target.value); }}>
              <option>Website</option>
              <option>Referral</option>
              <option>LinkedIn</option>
              <option>Facebook</option>
              <option>Instagram</option>
              <option>Advertisement</option>
              <option>Cold Call</option>
              <option>Email Campaign</option>
              <option>Other</option>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={form.status} onChange={function (e: any) { setField('status', e.target.value); }}>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Unqualified</option>
              <option>Converted</option>
              <option>Lost</option>
            </Select>
          </div>

          <div>
            <Label>Score</Label>
            <Select value={form.score} onChange={function (e: any) { setField('score', e.target.value); }}>
              <option>Cold</option>
              <option>Warm</option>
              <option>Hot</option>
            </Select>
          </div>

          <div>
            <Label>Estimated value</Label>
            <Input type="number" value={form.value} onChange={function (e: any) { setField('value', e.target.value); }} placeholder="25000" />
          </div>
        </div>

        <div className="mt-4">
          <Label>Notes</Label>
          <Textarea rows={3} value={form.notes} onChange={function (e: any) { setField('notes', e.target.value); }} placeholder="Context about this lead..." />
        </div>
      </Modal>
    </div>
  );
}
