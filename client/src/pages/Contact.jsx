import { useState } from 'react';
import { validateContact } from '../data/contactValidation';
import './contact-studio.css';
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);
  const [copyStatus, setCopyStatus] = useState('');
  const [errors, setErrors] = useState({});
  function update(field, value) {
    const next = { ...form, [field]: value };
    setForm(next);
    if (status?.type === 'validation' && !Object.keys(validateContact(next)).length) setStatus(null);
    if (errors[field]) setErrors(previous => ({ ...previous, [field]: validateContact(next)[field] }));
  }
  function validateField(field) {
    setErrors(previous => ({ ...previous, [field]: validateContact(form)[field] }));
  }
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    const nextErrors = validateContact(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus({ type: 'validation', text: 'Check the highlighted fields below. Your message has been kept.' });
      document.getElementById('contact-' + Object.keys(nextErrors)[0])?.focus();
      return;
    }
    setBusy(true); setStatus(null);
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
      const response = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(30000) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Your message could not be sent. Please use the direct email link.');
      setStatus({ type: 'success', text: 'Thank you. Your message has been received.' }); setForm({ name: '', email: '', message: '' });
    } catch (error) { setStatus({ type: 'error', text: error.name === 'TimeoutError' ? 'The request timed out. Your message is still here. Please email me directly or try again.' : error instanceof TypeError ? 'Could not connect. Your message is still here; check your connection and try again.' : error.message }); }
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
        {status && <div className={'studio-form-status ' + status.type} role={status.type === 'success' ? 'status' : 'alert'}><strong>{status.type === 'success' ? 'Message received.' : status.type === 'validation' ? 'A few details need attention.' : 'Delivery not confirmed.'}</strong><p>{status.text}</p>{status.type === 'error' && <a href="mailto:girme405@gmail.com">Email me directly instead</a>}</div>}
        <form onSubmit={submit} noValidate aria-busy={busy}><fieldset disabled={busy}><legend className="contact-sr-only">Your contact details and message</legend><div className="studio-contact-fields"><div><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={120} value={form.name} onChange={event => update('name', event.target.value)} onBlur={() => validateField('name')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} placeholder="Your full name" />{errors.name && <p className="contact-field-error" id="contact-name-error">{errors.name}</p>}</div><div><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={event => update('email', event.target.value)} onBlur={() => validateField('email')} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} placeholder="you@example.com" />{errors.email && <p className="contact-field-error" id="contact-email-error">{errors.email}</p>}</div></div><div className="contact-message-label"><label htmlFor="contact-message">Your message</label><span aria-hidden="true">{form.message.length.toLocaleString()} / 10,000</span></div><textarea id="contact-message" name="message" required minLength={10} maxLength={10000} rows={7} value={form.message} onChange={event => update('message', event.target.value)} onBlur={() => validateField('message')} aria-invalid={Boolean(errors.message)} aria-describedby={'contact-message-hint' + (errors.message ? ' contact-message-error' : '')} placeholder="What are you working on? Tell me about your idea, opportunity, or question…" />{errors.message && <p className="contact-field-error" id="contact-message-error">{errors.message}</p>}<p id="contact-message-hint" className="contact-message-hint">Please include at least 10 characters and any useful project details.</p><div className="contact-submit-row"><button className="studio-button" type="submit">{busy ? 'Sending…' : 'Send message'}</button><p>Your details are used to respond<br />to your inquiry.</p></div></fieldset></form>
      </div>
    </div>
  </section>;
}
