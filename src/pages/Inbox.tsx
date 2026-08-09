import React, { useEffect, useState } from 'react';
import { useTable } from '../lib/useTable';
import { Button, Card, Empty, ErrorPanel, PageHeader, Spinner, Textarea, cn } from '../components/ui';

export default function Inbox() {
  const conversations = useTable('nexacrm_conversations');
  const messages = useTable('nexacrm_messages');
  const contacts = useTable('nexacrm_contacts');
  const [activeId, setActiveId] = useState('');
  const [reply, setReply] = useState('');

  const loading = conversations.loading || messages.loading || contacts.loading;
  const error = conversations.error || messages.error || contacts.error;

  useEffect(function () {
    if (!activeId && conversations.rows.length > 0) {
      setActiveId(conversations.rows[0].id);
    }
  }, [conversations.rows, activeId]);

  function contactName(id: string) {
    const contact = contacts.rows.find(function (c: any) { return c.id === id; });
    return contact ? contact.name : 'Unknown';
  }

  async function openConversation(cv: any) {
    setActiveId(cv.id);
    if (cv.unread) {
      try {
        await conversations.update(cv.id, { unread: false });
      } catch (err) {
        // non-fatal
      }
    }
  }

  async function send() {
    if (!reply.trim() || !activeId) return;
    try {
      await messages.create({ conversation_id: activeId, sender: 'me', body: reply.trim() });
      setReply('');
    } catch (err: any) {
      window.alert(err.message || 'Failed to send reply.');
    }
  }

  const thread = messages.rows
    .filter(function (m: any) { return m.conversation_id === activeId; })
    .slice()
    .reverse();

  const active = conversations.rows.find(function (c: any) { return c.id === activeId; });

  if (loading) return <Spinner label="Loading inbox..." />;
  if (error) return <ErrorPanel error={error} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Inbox" subtitle="Conversations stored in Supabase (nexacrm_conversations / nexacrm_messages)." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          {conversations.rows.length === 0 ? (
            <Empty title="No conversations yet." />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {conversations.rows.map(function (cv: any) {
                return (
                  <button
                    key={cv.id}
                    onClick={function () { openConversation(cv); }}
                    className={cn(
                      'flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50',
                      activeId === cv.id && 'bg-indigo-50 dark:bg-indigo-500/10'
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cv.unread ? 'truncate text-sm font-semibold text-slate-800 dark:text-slate-100' : 'truncate text-sm font-medium text-slate-600 dark:text-slate-300'}>
                          {contactName(cv.contact_id)}
                        </span>
                        {cv.unread ? <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600"></span> : null}
                      </div>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{cv.subject}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="flex flex-col lg:col-span-2">
          {active ? (
            <React.Fragment>
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{active.subject}</p>
                <p className="text-xs text-slate-400">{contactName(active.contact_id)}</p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-5" style={{ maxHeight: 420 }}>
                {thread.length === 0 ? <Empty title="No messages yet." /> : null}
                {thread.map(function (m: any) {
                  const mine = m.sender === 'me';
                  return (
                    <div key={m.id} className={mine ? 'flex justify-end' : 'flex justify-start'}>
                      <div className={mine ? 'max-w-[75%] rounded-2xl rounded-br-md bg-indigo-600 px-4 py-2.5 text-sm text-white' : 'max-w-[75%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200'}>
                        <p>{m.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 p-4 dark:border-slate-800">
                <Textarea rows={2} value={reply} onChange={function (e: any) { setReply(e.target.value); }} placeholder="Write a reply..." />
                <div className="mt-2 flex justify-end">
                  <Button onClick={send}>Send</Button>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <Empty title="Select a conversation." />
          )}
        </Card>
      </div>
    </div>
  );
}
