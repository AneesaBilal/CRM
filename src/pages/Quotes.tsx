import React, { useState } from 'react';
import { useTable } from '../lib/useTable';
import { Badge, Button, Card, Empty, ErrorPanel, Input, Label, Modal, PageHeader, Select, Spinner } from '../components/ui';

function currency(value: any) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function quoteTotals(quote: any) {
  const items = quote.items || [];
  const subtotal = items.reduce(function (sum: number, item: any) {
    return sum + Number(item.qty || 0) * Number(item.price || 0);
  }, 0);
  const discount = Math.round(subtotal * Number(quote.discount || 0) / 100);
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * Number(quote.tax || 0) / 100);
  return { subtotal: subtotal, discount: discount, tax: tax, total: taxable + tax };
}

export default function Quotes() {
  const quotes = useTable('nexacrm_quotes');
  const companies = useTable('nexacrm_companies');
  const contacts = useTable('nexacrm_contacts');
  const products = useTable('nexacrm_products');

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ company_id: '', contact_id: '', status: 'Draft', expiration: '' });
  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loading = quotes.loading || companies.loading || contacts.loading || products.loading;
  const error = quotes.error || companies.error || contacts.error || products.error;

  function companyName(id: string) {
    const company = companies.rows.find(function (c: any) { return c.id === id; });
    return company ? company.name : '—';
  }

  function contactName(id: string) {
    const contact = contacts.rows.find(function (c: any) { return c.id === id; });
    return contact ? contact.name : '—';
  }

  function productName(id: string) {
    const product = products.rows.find(function (p: any) { return p.id === id; });
    return product ? product.name : '—';
  }

  function addItem() {
    const first = products.rows[0];
    setItems(items.concat([{ product_id: first ? first.id : '', qty: '1' }]));
  }

  function setItem(index: number, field: string, value: any) {
    setItems(items.map(function (item, i) {
      if (i !== index) return item;
      const next = Object.assign({}, item);
      next[field] = value;
      return next;
    }));
  }

  function removeItem(index: number) {
    setItems(items.filter(function (_item, i) { return i !== index; }));
  }

  async function save() {
    setMessage('');

    const validItems = items
      .filter(function (item) { return item.product_id; })
      .map(function (item) {
        const product = products.rows.find(function (p: any) { return p.id === item.product_id; });
        return {
          product_id: item.product_id,
          qty: Number(item.qty || 1),
          price: product ? Number(product.price || 0) : 0
        };
      });

    if (validItems.length === 0) {
      setMessage('Add at least one line item.');
      return;
    }

    setSaving(true);
    try {
      await quotes.create({
        number: 'QT-2026-' + String(quotes.rows.length + 1).padStart(3, '0'),
        company_id: form.company_id || null,
        contact_id: form.contact_id || null,
        status: form.status,
        expiration: form.expiration || null,
        items: validItems,
        discount: 0,
        tax: 8
      });
      setOpen(false);
      setForm({ company_id: '', contact_id: '', status: 'Draft', expiration: '' });
      setItems([]);
    } catch (err: any) {
      setMessage(err.message || 'Failed to create quote.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteQuote(quote: any) {
    if (!window.confirm('Delete quote ' + quote.number + '?')) return;
    try {
      await quotes.remove(quote.id);
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete quote.');
    }
  }

  if (loading) return <Spinner label="Loading quotes..." />;
  if (error) return <ErrorPanel error={error} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Quotes"
        subtitle="Proposals stored in nexacrm_quotes with line items."
        action={<Button onClick={function () { setOpen(true); }}>Create Quote</Button>}
      />

      <Card>
        {quotes.rows.length === 0 ? (
          <Empty title="No quotes yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                  <th className="px-4 py-3 font-medium">Quote #</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Expires</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {quotes.rows.map(function (quote: any) {
                  const totals = quoteTotals(quote);
                  return (
                    <tr key={quote.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-slate-700 dark:text-slate-200">{quote.number}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{companyName(quote.company_id)}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{contactName(quote.contact_id)}</td>
                      <td className="px-4 py-3"><Badge>{quote.status}</Badge></td>
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{currency(totals.total)}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{quote.expiration || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="danger" onClick={function () { deleteQuote(quote); }}>Delete</Button>
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
        title="Create Quote"
        footer={
          <React.Fragment>
            <Button variant="secondary" onClick={function () { setOpen(false); }}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Create quote'}</Button>
          </React.Fragment>
        }
      >
        {message ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{message}</div> : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <Label>Contact</Label>
            <Select value={form.contact_id} onChange={function (e: any) { setForm(Object.assign({}, form, { contact_id: e.target.value })); }}>
              <option value="">No contact</option>
              {contacts.rows.map(function (contact: any) {
                return <option key={contact.id} value={contact.id}>{contact.name}</option>;
              })}
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={form.status} onChange={function (e: any) { setForm(Object.assign({}, form, { status: e.target.value })); }}>
              <option>Draft</option>
              <option>Sent</option>
              <option>Accepted</option>
              <option>Rejected</option>
              <option>Expired</option>
            </Select>
          </div>

          <div>
            <Label>Expiration</Label>
            <Input type="date" value={form.expiration} onChange={function (e: any) { setForm(Object.assign({}, form, { expiration: e.target.value })); }} />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <Label>Line items</Label>
            <Button variant="secondary" onClick={addItem}>Add item</Button>
          </div>

          {items.length === 0 ? <p className="text-xs text-slate-400">No line items yet.</p> : null}

          <div className="space-y-2">
            {items.map(function (item, index) {
              return (
                <div key={index} className="flex items-center gap-2">
                  <Select value={item.product_id} onChange={function (e: any) { setItem(index, 'product_id', e.target.value); }} className="flex-1">
                    {products.rows.map(function (product: any) {
                      return <option key={product.id} value={product.id}>{product.name} ({currency(product.price)})</option>;
                    })}
                  </Select>
                  <Input type="number" value={item.qty} onChange={function (e: any) { setItem(index, 'qty', e.target.value); }} className="w-20" />
                  <Button variant="danger" onClick={function () { removeItem(index); }}>Remove</Button>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
