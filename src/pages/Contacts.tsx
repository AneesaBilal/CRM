import React, { useMemo, useState } from 'react';
import { useTable } from '../lib/useTable';
import { Button, Card, Empty, ErrorPanel, Input, Label, Modal, PageHeader, Select, Spinner } from '../components/ui';

const emptyForm = {
  name: '',
  title: '',
  email: '',
  phone: '',
  company_id: '',
  status: 'Active'
};

export default function Contacts() {
  const contacts = useTable('nexacrm_contacts');
  const companies = useTable('nexacrm_companies');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loading = contacts.loading || companies.loading;
  const error = contacts.error || companies.error;

  const filtered = useMemo(function () {
    const term = search.trim().toLowerCase();
    if (!term) return contacts.rows;

    return contacts.rows.filter(function (contact: any) {
      return [contact.name, contact.email, contact.title, contact.status]
        .filter(Boolean)
        .some(function (value) {
          return String(value).toLowerCase().indexOf(term) >= 0;
        });
    });
  }, [contacts.rows, search]);

  function companyName(id: string) {
    const company = companies.rows.find(function (item: any) {
      return item.id === id;
    });
    return company ? company.name : '—';
  }

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
      setMessage('Contact name is required.');
      return;
    }

    setSaving(true);
    try {
      await contacts.create({
        name: form.name.trim(),
        title: form.title.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        company_id: form.company_id || null,
        status: form.status
      });

      setOpen(false);
      setForm(emptyForm);
    } catch (err: any) {
      setMessage(err.message || 'Failed to create contact.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteContact(contact: any) {
    if (!window.confirm('Delete contact ' + contact.name + '?')) return;

    try {
      await contacts.remove(contact.id);
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete contact.');
    }
  }

  if (loading) return <Spinner label="Loading contacts..." />;
  if (error) return <ErrorPanel error={error} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Contacts"
        subtitle="Managed in Supabase table nexacrm_contacts."
        action={<Button onClick={function () { setOpen(true); }}>Add Contact</Button>}
      />

      <Card>
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <Input
            value={search}
            onChange={function (e: any) { setSearch(e.target.value); }}
            placeholder="Search contacts..."
            className="max-w-md"
          />
        </div>

        {filtered.length === 0 ? (
          <Empty title="No contacts found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(function (contact: any) {
                  return (
                    <tr key={contact.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{contact.name}</div>
                        {contact.title ? <div className="text-xs text-slate-400">{contact.title}</div> : null}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{companyName(contact.company_id)}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{contact.email || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{contact.phone || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{contact.status}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="danger" onClick={function () { deleteContact(contact); }}>Delete</Button>
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
        title="Add Contact"
        footer={
          <React.Fragment>
            <Button variant="secondary" onClick={function () { setOpen(false); }}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Create contact'}</Button>
          </React.Fragment>
        }
      >
        {message ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{message}</div> : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={function (e: any) { setField('name', e.target.value); }} placeholder="Grace Liu" />
          </div>

          <div>
            <Label>Job title</Label>
            <Input value={form.title} onChange={function (e: any) { setField('title', e.target.value); }} placeholder="VP Finance" />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={function (e: any) { setField('email', e.target.value); }} placeholder="grace@company.com" />
          </div>

          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={function (e: any) { setField('phone', e.target.value); }} placeholder="+1 555 000 0000" />
          </div>

          <div>
            <Label>Company</Label>
            <Select value={form.company_id} onChange={function (e: any) { setField('company_id', e.target.value); }}>
              <option value="">No company</option>
              {companies.rows.map(function (company: any) {
                return <option key={company.id} value={company.id}>{company.name}</option>;
              })}
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={form.status} onChange={function (e: any) { setField('status', e.target.value); }}>
              <option>Active</option>
              <option>Inactive</option>
              <option>Prospect</option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
