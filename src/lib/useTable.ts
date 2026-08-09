import { useCallback, useEffect, useState } from 'react';
import { fetchRows, insertRow, updateRow, deleteRow } from './api';

export function useTable(table: string) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async function () {
    setLoading(true);
    setError('');
    try {
      const data = await fetchRows(table);
      setRows(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(function () {
    load();
  }, [load]);

  async function create(row: any) {
    const created = await insertRow(table, row);
    await load();
    return created;
  }

  async function update(id: string, row: any) {
    const updated = await updateRow(table, id, row);
    await load();
    return updated;
  }

  async function remove(id: string) {
    await deleteRow(table, id);
    await load();
  }

  return {
    rows: rows,
    loading: loading,
    error: error,
    load: load,
    create: create,
    update: update,
    remove: remove
  };
}
