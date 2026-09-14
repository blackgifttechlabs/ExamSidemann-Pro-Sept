import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Loader2, Mail, ShieldCheck, X } from 'lucide-react';
import { accountAutomation, type AutomationSettings, type AutomationStatus } from '../../services/accountAutomation';

export function AccountAutomationPanel() {
  const [data, setData] = useState<AutomationStatus | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState('');
  const mounted = useRef(true);
  const refresh = async () => setData(await accountAutomation<AutomationStatus>('status'));

  useEffect(() => {
    mounted.current = true;
    void refresh().catch(error => setError(error.message));
    return () => { mounted.current = false; };
  }, []);

  const run = async (name: string, action: () => Promise<void>) => {
    setBusy(name); setError(''); setNotice('');
    try { await action(); }
    catch (error) { setError(error instanceof Error ? error.message : 'The request failed.'); }
    finally { if (mounted.current) setBusy(''); }
  };

  const verifyPending = async () => {
    let total = 0;
    for (const projectId of data?.connection.projects || []) {
      let cursor: string | null = null;
      do {
        if (!mounted.current) return;
        const page: { approved: number; cursor: string | null } = await accountAutomation('sweep-teachers', { projectId, cursor });
        total += page.approved; cursor = page.cursor;
        setNotice(`Verified ${total} pending teacher account${total === 1 ? '' : 's'}…`);
      } while (cursor);
    }
    // Finish the newly queued messages without exceeding one function's runtime.
    let sent: number;
    do {
      if (!mounted.current) return;
      const result = await accountAutomation<{ work: { deliveries: unknown[] }[] }>('retry-emails');
      sent = result.work.reduce((count, project) => count + project.deliveries.length, 0);
    } while (sent);
    setNotice(`Verified ${total} pending teacher account${total === 1 ? '' : 's'}. Check the delivery log for email status.`);
  };

  const toggle = (key: keyof AutomationSettings) => run(key, async () => {
    if (!data) return;
    const settings = { ...data.settings, [key]: !data.settings[key] };
    await accountAutomation('settings', { settings });
    setData(current => current ? { ...current, settings } : current);
    if (key === 'autoVerifyTeachers' && settings.autoVerifyTeachers) await verifyPending();
    else setNotice('Automation settings saved.');
    await refresh();
  });

  const switches: { key: keyof AutomationSettings; label: string; detail: string }[] = [
    { key: 'autoVerifyTeachers', label: 'Auto-verify teachers', detail: 'Approve new and pending teacher applications automatically.' },
    { key: 'emailsEnabled', label: 'Automatic email sending', detail: 'Send account emails from your connected mailbox.' },
  ];
  const button = 'rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5';

  return (
    <section aria-label="Account automation" className="mb-5 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#161616] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white"><ShieldCheck size={17} /> Account automation</h3>
        <button type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-controls="email-connection-settings" className={`${button} flex items-center gap-2`}><Mail size={14} /> Email settings <ChevronDown size={14} /></button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {switches.map(({ key, label, detail }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div><p id={`automation-${key}`} className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div>
            <button type="button" role="switch" aria-labelledby={`automation-${key}`} aria-checked={data?.settings[key] || false} disabled={!data || Boolean(busy)} onClick={() => void toggle(key)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40 ${data?.settings[key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${data?.settings[key] ? 'left-[22px]' : 'left-0.5'}`} /></button>
          </div>
        ))}
      </div>
      {busy && <p role="status" className="mt-3 flex items-center gap-2 text-xs text-slate-500"><Loader2 size={13} className="animate-spin" /> Updating account automation…</p>}
      {notice && <p role="status" className="mt-3 text-xs text-emerald-700 dark:text-emerald-300">{notice}</p>}
      {error && <div role="alert" className="mt-3 text-xs leading-5 text-rose-600 dark:text-rose-300">{error} <button type="button" className="ml-2 underline" onClick={() => void run('refresh', refresh)}>Retry</button></div>}
      {expanded && (
        <div id="email-connection-settings" className="mt-5 space-y-4 border-t border-slate-200 pt-4 dark:border-white/10">
          <div><p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{data?.connection.smtpReady ? `Configured: ${data.connection.sender}` : 'Connect your email on the server'}</p><p className="mt-1 text-xs leading-5 text-slate-500">Add your mailbox and app password to the hosting environment, then check the connection here. Passwords are never saved in this page.</p></div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={Boolean(busy) || !data?.connection.smtpReady} className={button} onClick={() => void run('connection', async () => { await accountAutomation('check-connection'); setNotice('SMTP connection checked successfully.'); })}>Check connection</button>
            <button type="button" disabled={Boolean(busy) || !data?.connection.smtpReady} className={button} onClick={() => void run('test', async () => { const result = await accountAutomation<{ status: string }>('test-email'); setNotice(result.status === 'sent' ? 'Test email sent to your administrator email address.' : 'The test email is queued. Check the delivery log.'); await refresh(); })}>Send test to my email</button>
            <button type="button" disabled={Boolean(busy) || !data} className={button} onClick={() => void run('retry', async () => { await accountAutomation('retry-emails'); await refresh(); setNotice('Queued deliveries checked.'); })}>Retry queued emails</button>
            <button type="button" disabled={Boolean(busy) || !data?.settings.autoVerifyTeachers} className={button} onClick={() => void run('pending', async () => { await verifyPending(); await refresh(); })}>Verify pending teachers</button>
          </div>
          <div className="flex flex-wrap gap-5">
            {(['signInEmails', 'teacherApprovalEmails'] as const).map(key => <label key={key} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><input type="checkbox" disabled={!data || Boolean(busy)} checked={data?.settings[key] ?? true} onChange={() => void toggle(key)} className="accent-emerald-600" />{key === 'signInEmails' ? 'Email after each new sign-in' : 'Email after teacher approval'}</label>)}
          </div>
          <div className="flex flex-wrap gap-2">
            {(['teacher-approved', 'sign-in'] as const).map(kind => <button type="button" key={kind} disabled={!data || Boolean(busy)} className={button} onClick={() => void run('preview', async () => { const result = await accountAutomation<{ html: string }>('preview', { kind }); setPreview(result.html); })}>Preview {kind === 'teacher-approved' ? 'teacher email' : 'sign-in email'}</button>)}
          </div>
          {preview && <div className="rounded-lg border border-slate-200 p-2 dark:border-white/10"><div className="mb-2 flex justify-end"><button type="button" aria-label="Close email preview" onClick={() => setPreview('')} className="p-1"><X size={16} /></button></div><iframe title="Account email preview" sandbox="" srcDoc={preview} className="h-[520px] w-full rounded bg-white" /></div>}
          <div className="overflow-x-auto"><table className="w-full text-left text-xs"><caption className="mb-2 text-left font-semibold text-slate-700 dark:text-slate-200">Recent email deliveries</caption><thead className="text-slate-500"><tr><th className="py-2 pr-3">Recipient</th><th className="pr-3">Email</th><th>Status</th></tr></thead><tbody>{data?.deliveries.map(mail => <tr key={`${mail.projectId}-${mail.id}`} className="border-t border-slate-100 dark:border-white/5"><td className="max-w-[240px] truncate py-2 pr-3 text-slate-700 dark:text-slate-200">{mail.recipient}</td><td className="pr-3 text-slate-500">{mail.kind}</td><td className="text-slate-600 dark:text-slate-300">{mail.status}{['retry', 'failed'].includes(mail.status) && <button type="button" disabled={Boolean(busy)} className="ml-2 underline" onClick={() => void run('retry', async () => { await accountAutomation('retry-email', { id: mail.id, projectId: mail.projectId }); await refresh(); })}>Retry</button>}</td></tr>)}</tbody></table>{!data?.deliveries.length && <p className="py-2 text-xs text-slate-400">No emails sent yet.</p>}</div>
        </div>
      )}
    </section>
  );
}
