import React, { useState } from 'react';
import { useTable } from '../lib/useTable';
import { Badge, Button, Card, Empty, ErrorPanel, Input, Label, Modal, PageHeader, Select, Spinner, Textarea } from '../components/ui';

const emptyForm = { name: '', sku: '', price: '', category: 'Subscription', status: 'Active', description: '' };

function currency(value: any) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

export default function Products() {
  const table = useTable('nexacrm_products');
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
    if (!form.name.trim()) {
      setMessage('Product name is required.');
      return;
    }

    setSaving(true);
    try {
      await table.create({
        name: form.name.trim(),
        sku: form.sku.trim() || null,
        price: Number(form.price || 0),
        category: form.category,
        status: form.status,
        description: form.description.trim() || null
      });
      setOpen(false);
      setForm(emptyForm);
    } catch (err: any) {
      setMessage(err.message || 'Failed to create product.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: any) {
    if (!window.confirm('Delete product ' + product.name + '?')) return;
    try {
      await table.remove(product.id);
    } catch (err: any) {
      window.alert(err.message || 'Failed to delete product.');
    }
  }

  if (table.loading) return <Spinner label="Loading products..." />;
  if (table.error) return <ErrorPanel error={table.error} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Products & Services"
        subtitle="Catalog stored in nexacrm_products, used by quotes."
        action={<Button onClick={function () { setOpen(true); }}>Add Product</Button>}
      />

      <Card>
        {table.rows.length === 0 ? (
          <Empty title="No products yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {table.rows.map(function (product: any) {
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{product.name}</div>
                        {product.description ? <div className="text-xs text-slate-400">{product.description}</div> : null}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{product.sku || '—'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{product.category || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{currency(product.price)}</td>
                      <td className="px-4 py-3"><Badge>{product.status}</Badge></td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="danger" onClick={function () { deleteProduct(product); }}>Delete</Button>
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
        title="Add Product"
        footer={
          <React.Fragment>
            <Button variant="secondary" onClick={function () { setOpen(false); }}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Create product'}</Button>
          </React.Fragment>
        }
      >
        {message ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{message}</div> : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={function (e: any) { setField('name', e.target.value); }} placeholder="Nexa Platform - Growth" />
          </div>
          <div>
            <Label>SKU</Label>
            <Input value={form.sku} onChange={function (e: any) { setField('sku', e.target.value); }} placeholder="NEX-001" />
          </div>
          <div>
            <Label>Price</Label>
            <Input type="number" value={form.price} onChange={function (e: any) { setField('price', e.target.value); }} placeholder="499" />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onChange={function (e: any) { setField('category', e.target.value); }}>
              <option>Subscription</option>
              <option>Services</option>
              <option>Add-on</option>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onChange={function (e: any) { setField('status', e.target.value); }}>
              <option>Active</option>
              <option>Inactive</option>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label>Description</Label>
          <Textarea rows={2} value={form.description} onChange={function (e: any) { setField('description', e.target.value); }} placeholder="What is included?" />
        </div>
      </Modal>
    </div>
  );
}
