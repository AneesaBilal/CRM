import React, { useMemo, useState } from 'react';
import { useTable } from '../lib/useTable';
import { Badge, Button, Card, Empty, ErrorPanel, Input, Label, Modal, PageHeader, Select, Spinner } from '../components/ui';

const stages = ['Lead', 'Qualified', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'];

const emptyForm = {
  name: '',
  amount: '',
  stage: 'Lead',
  probability: '20',
  close_date: '',
  company_id: '',
  contact_id: ''
};

function currency(value: any) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export default function Deals() {
  const deals = useTable('nexacrm_deals');
  const companies = useTable('nexacrm_companies');
  const contacts = useTable('nexacrm_contacts');

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loading = deals.loading || companies.loading || contacts.loading;
  const error = deals.error || companies.error || contacts.error;

  const filtered = useMemo(function () {
    const term = search.trim().toLowerCase();
    if (!term) return deals.rows;

    return deals.rows.filter(function (deal: any) {
      return [deal.name, deal.stage, deal.status]
        .filter(Boolean)
        .some(function (value) {
          return String(value).toLowerCase().indexOf(term) >= 0;
        });
    });
  }, [deals.rows, search]);

  function companyName(id: string) {
    const company = companies.rows.find(function (item: any) {
      return item.id === id;
    });
    return company ? company.name : '—';
  }

  function contactName(id: string) {
    const contact = contacts.rows.find(function (item: any) {
      return item.id === id;
    });
    return contact ? contact.name : '—';
  }

  function setField(field: string, value: any) {
    setForm(function (prev) {
      const next = Object.assign({}, prev);
      next[field] = value;
      return next;
    });
  }

  function stagePatch(stage: string) {
    const patch: any = { stage: stage };

    if (stage === 'Won') {
      patch.status = 'Won';
      patch.probability = 100;
    } else if (stage === 'Lost') {
      patch.status = 'Lost';
      patch.probability = 0;
    } else {
      patch.status = 'Open';
    }

    return patch;
  }

  async function changeStage(deal: any, stage: string) {
    try {
      await deals.update(deal.id, stagePatch(stage));
    } catch (err: any) {
      window.alert(err.message || 'Failed to update deal stage.');
    }
  }

  async function save() {
    setMessage('');

    if (!form.name.trim()) {
      setMessage('Deal name is required.');
      return;
    }

    if (Number(form.amount || 0) <= 0) {
      setMessage('Deal amount must be greater than zero.');
      return;
    }

    setSaving(true);
    try {
      await deals.create({
        name: form.name.trim(),
        amount: Number(form.amount || 0),
        stage: form.stage,
        probability: Number(form.probability || 20),
        close_date: form.close_date || null,
        company_id: form.company_id || null,
        contact_id: form.contact_id || null,
        status: form.stage === 'Won' ? 'Won' : form.stage === 'Lost' ? 'Lost' : 'Open'
      });

      setOpen(false);
      setForm(emptyForm);
    } catch (err: any) {
      setMessage(err.message || 'Failed to create deal.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteDeal(deal: any) {
    if (!window.confirm('Delete deal ' + deal.name + '?')) return;

    try {
      await deals.remove(deal.id);
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete deal.');
    }
  }

  if (loading) return <Spinner label="Loading deals..." />;
  if (error) return <ErrorPanel error={error} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Deals"
        subtitle="Managed in Supabase table nexacrm_deals."
        action={<Button onClick={function () { setOpen(true); }}>Create Deal</Button>}
      />

      <Card>
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <Input
            value={search}
            onChange={function (e: any) { setSearch(e.target.value); }}
            placeholder="Search deals..."
            className="max-w-md"
          />
        </div>

        {filtered.length === 0 ? (
          <Empty title="No deals found." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                  <th className="px-4 py-3 font-medium">Deal</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(function (deal: any) {
                  return (
                    <tr key={deal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{deal.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{companyName(deal.company_id)}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{contactName(deal.contact_id)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{currency(deal.amount)}</td>
                      <td className="px-4 py-3">
                        <Select
                          value={deal.stage}
                          onChange={function (e: any) { changeStage(deal, e.target.value); }}
                          className="h-8 w-36 text-xs"
                        >
                          {stages.map(function (stage) {
                            return <option key={stage}>{stage}</option>;
                          })}
                        </Select>
                      </td>
                      <td className="px-4 py-3"><Badge>{deal.status}</Badge></td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="danger" onClick={function () { deleteDeal(deal); }}>Delete</Button>
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
        title="Create Deal"
        footer={
          <React.Fragment>
            <Button variant="secondary" onClick={function () { setOpen(false); }}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Create deal'}</Button>
          </React.Fragment>
        }
      >
        {message ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{message}</div> : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Deal name</Label>
            <Input value={form.name} onChange={function (e: any) { setField('name', e.target.value); }} placeholder="Enterprise expansion" />
          </div>

          <div>
            <Label>Amount</Label>
            <Input type="number" value={form.amount} onChange={function (e: any) { setField('amount', e.target.value); }} placeholder="50000" />
          </div>

          <div>
            <Label>Stage</Label>
            <Select value={form.stage} onChange={function (e: any) { setField('stage', e.target.value); }}>
              {stages.map(function (stage) {
                return <option key={stage}>{stage}</option>;
              })}
            </Select>
          </div>

          <div>
            <Label>Probability</Label>
            <Input type="number" value={form.probability} onChange={function (e: any) { setField('probability', e.target.value); }} placeholder="25" />
          </div>

          <div>
            <Label>Expected close date</Label>
            <Input type="date" value={form.close_date} onChange={function (e: any) { setField('close_date', e.target.value); }} />
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
            <Label>Contact</Label>
            <Select value={form.contact_id} onChange={function (e: any) { setField('contact_id', e.target.value); }}>
              <option value="">No contact</option>
              {contacts.rows.map(function (contact: any) {
                return <option key={contact.id} value={contact.id}>{contact.name}</option>;
              })}
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
