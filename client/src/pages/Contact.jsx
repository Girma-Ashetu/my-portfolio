import { useState } from 'react';
import './contact-studio.css';
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  async function submit(event) {
    event.preventDefault(); if (busy) return; setBusy(true); setStatus(null);
    try {
      const response = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form), signal: AbortSignal.timeout(30000) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Your message could not be sent. Please use the direct email link.');
      setStatus({ type: 'success', text: 'Thank you. Your message has been received.' }); setForm({ name: '', email: '', message: '' });
    } catch (error) { setStatus({ type: 'error', text: error.name === 'TimeoutError' ? 'The request timed out. Please email me directly or try again.' : error.message }); }
    finally { setBusy(false); }
  }
  async function copyEmail() {
    try { await navigator.clipboard.writeText('girme405@gmail.com'); setCopyStatus('Email address copied.'); }
    catch { setCopyStatus('Please use the email link to open your mail app.'); }
  }
  return <section className="studio-page studio-container contact-page">
    <header className="contact-intro"><div><p className="studio-eyebrow">GOOD WORK STARTS WITH A CONVERSATION</p><h1>Bring your ideas.<br /><span>Let’s connect.</span></h1></div><p>A project to explore, an opportunity to discuss, or a question about my work—I’d love to hear from you.</p></header>
    <div className="studio-contact-grid">
      <aside className="contact-options" aria-label="Direct contact options">
        <div className="contact-email-card"><div className="contact-mail-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="7" width="24" height="18" rx="3"/><path d="m5 9 11 9L27 9"/></svg></div><p className="studio-eyebrow">PREFER A DIRECT MESSAGE?</p><h2>Email me.</h2><p>A simple way to start the conversation.</p><a href="mailto:girme405@gmail.com">girme405@gmail.com</a><button type="button" className="contact-copy-button" onClick={copyEmail}>Copy email address</button><p className="contact-copy-status" role="status">{copyStatus}</p></div>
        <div className="contact-online"><h2>Find me online</h2><a href="https://github.com/Girma-Ashetu" target="_blank" rel="noopener noreferrer"><span>GitHub</span><small>Projects & source code</small></a><a href="https://www.linkedin.com/in/girma-ashetu-a146b9422" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><small>Professional profile</small></a><a href="https://t.me/Progirma35" target="_blank" rel="noopener noreferrer"><span>Telegram</span><small>Start a conversation</small></a></div>
        <div className="contact-location"><span>BASED IN</span><strong>Jimma, Ethiopia</strong><p>East Africa Time · UTC+3</p></div>
      </aside>
      <div className="studio-contact-form"><p className="studio-eyebrow">TELL ME WHAT YOU HAVE IN MIND</p><h2>Leave a message.</h2><p className="contact-form-intro">Share a little context and how I can help. All fields are required.</p>
        {status && <div className={'studio-form-status ' + status.type} role={status.type === 'error' ? 'alert' : 'status'}><strong>{status.type === 'error' ? 'Your message wasn’t sent.' : 'Message received.'}</strong><p>{status.text}</p>{status.type === 'error' && <a href="mailto:girme405@gmail.com">Email me directly instead</a>}</div>}
        <form onSubmit={submit} aria-busy={busy}><fieldset disabled={busy}><legend className="contact-sr-only">Your contact details and message</legend><div className="studio-contact-fields"><div><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={120} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Your full name" /></div><div><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></div></div><div className="contact-message-label"><label htmlFor="contact-message">Your message</label><span aria-hidden="true">{form.message.length.toLocaleString()} / 10,000</span></div><textarea id="contact-message" name="message" required minLength={10} maxLength={10000} rows={7} value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} aria-describedby="contact-message-hint" placeholder="What are you working on? Tell me about your idea, opportunity, or question…" /><p id="contact-message-hint" className="contact-message-hint">Please include at least 10 characters and any useful project details.</p><div className="contact-submit-row"><button className="studio-button" type="submit">{busy ? 'Sending…' : 'Send message'}</button><p>Your details are used to respond<br />to your inquiry.</p></div></fieldset></form>
      </div>
    </div>
  </section>;
}
