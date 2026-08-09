import React, { useMemo, useState } from 'react';
import { useTable } from '../lib/useTable';
import { Button, Card, Empty, ErrorPanel, Input, Label, Modal, PageHeader, Select, Spinner, Textarea } from '../components/ui';

const emptyForm = {
  name: '',
  industry: '',
  website: '',
  phone: '',
  city: '',
  country: '',
  size: '1-50',
  revenue: '',
  status: 'Active',
  description: ''
};

export default function Companies() {
  const table = useTable('nexacrm_companies');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(function () {
    const term = search.trim().toLowerCase();
    if (!term) return table.rows;

    return table.rows.filter(function (company: any) {
      return [company.name, company.industry, company.city, company.country, company.status]
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
      setMessage('Company name is required.');
      return;
    }

    setSaving(true);
    try {
      await table.create({
        name: form.name.trim(),
        industry: form.industry.trim() || null,
        website: form.website.trim() || null,
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
        country: form.country.trim() || null,
        size: form.size,
        revenue: Number(form.revenue || 0),
        status: form.status,
        description: form.description.trim() || null
      });

      setOpen(false);
      setForm(emptyForm);
    } catch (err: any) {
      setMessage(err.message || 'Failed to create company.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteCompany(company: any) {
    if (!window.confirm('Delete company ' + company.name + '?')) return;

    try {
      await table.remove(company.id);
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete company.');
    }
  }

  if (table.loading) return <Spinner label="Loading companies..." />;
  if (table.error) return <ErrorPanel error={table.error} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Companies"
        subtitle="Managed in Supabase table nexacrm_companies."
        action={<Button onClick={function () { setOpen(true); }}>Add Company</Button>}
      />

      <Card>
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <Input
            value={search}
            onChange={function (e: any) { setSearch(e.target.value); }}
            placeholder="Search companies..."
            className="max-w-md"
          />
        </div>

        {filtered.length === 0 ? (
          <Empty title="No companies found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Industry</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(function (company: any) {
                  return (
                    <tr key={company.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{company.name}</div>
                        {company.website ? <div className="text-xs text-slate-400">{company.website}</div> : null}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{company.industry || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {[company.city, company.country].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{company.size || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{company.status}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="danger" onClick={function () { deleteCompany(company); }}>Delete</Button>
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
        title="Add Company"
        footer={
          <React.Fragment>
            <Button variant="secondary" onClick={function () { setOpen(false); }}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Create company'}</Button>
          </React.Fragment>
        }
      >
        {message ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{message}</div> : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Company name</Label>
            <Input value={form.name} onChange={function (e: any) { setField('name', e.target.value); }} placeholder="Acme Inc" />
          </div>

          <div>
            <Label>Industry</Label>
            <Input value={form.industry} onChange={function (e: any) { setField('industry', e.target.value); }} placeholder="Software" />
          </div>

          <div>
            <Label>Website</Label>
            <Input value={form.website} onChange={function (e: any) { setField('website', e.target.value); }} placeholder="company.com" />
          </div>

          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={function (e: any) { setField('phone', e.target.value); }} placeholder="+1 555 000 0000" />
          </div>

          <div>
            <Label>City</Label>
            <Input value={form.city} onChange={function (e: any) { setField('city', e.target.value); }} placeholder="San Francisco" />
          </div>

          <div>
            <Label>Country</Label>
            <Input value={form.country} onChange={function (e: any) { setField('country', e.target.value); }} placeholder="USA" />
          </div>

          <div>
            <Label>Company size</Label>
            <Select value={form.size} onChange={function (e: any) { setField('size', e.target.value); }}>
              <option>1-50</option>
              <option>51-200</option>
              <option>201-500</option>
              <option>501-1000</option>
              <option>1000+</option>
            </Select>
          </div>

          <div>
            <Label>Annual revenue</Label>
            <Input type="number" value={form.revenue} onChange={function (e: any) { setField('revenue', e.target.value); }} placeholder="1000000" />
          </div>

          <div>
            <Label>Status</Label>
            <Select value={form.status} onChange={function (e: any) { setField('status', e.target.value); }}>
              <option>Active</option>
              <option>Inactive</option>
              <option>Prospect</option>
              <option>Churned</option>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label>Description</Label>
          <Textarea rows={3} value={form.description} onChange={function (e: any) { setField('description', e.target.value); }} placeholder="What does this company do?" />
        </div>
      </Modal>
    </div>
  );
}
