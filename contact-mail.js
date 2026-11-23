const nodemailer = require('nodemailer');
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

function createContactNotifier({ env = process.env, createTransport = options => nodemailer.createTransport(options) } = {}) {
  return async (name, email, message) => {
    if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD || env.GMAIL_USER === 'your_gmail@gmail.com') return false;
    const transporter = createTransport({ service: 'gmail', auth: { user: env.GMAIL_USER, pass: env.GMAIL_APP_PASSWORD }, connectionTimeout: 4000, greetingTimeout: 4000, socketTimeout: 6000 });
    const sender = name.replace(/[\r\n]/g, ' ');
    const body = `<div style="font-family:Arial,sans-serif;color:#1a3026;line-height:1.8;max-width:600px"><h2>Portfolio inquiry</h2><p><strong>From:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><div style="white-space:pre-wrap;border-left:3px solid #28563d;padding:16px;background:#f5f8f6">${escapeHtml(message)}</div></div>`;
    await transporter.sendMail({ from: { name: 'Portfolio Contact', address: env.GMAIL_USER }, to: env.GMAIL_USER, replyTo: email, subject: `Portfolio message from ${sender}`, text: `From: ${name}\nEmail: ${email}\n\n${message}`, html: body });
    // Owner delivery is already confirmed; an acknowledgement failure must not report the inquiry as lost.
    try {
      await transporter.sendMail({ from: { name: 'Girma Ashetu', address: env.GMAIL_USER }, to: email, subject: 'Your portfolio message was received', text: `Hello ${name},\n\nThank you for reaching out. Your message has been received.\n\nGirma Ashetu`, html: `<div style="font-family:Arial,sans-serif;line-height:1.8"><p>Hello ${escapeHtml(name)},</p><p>Thank you for reaching out. Your message has been received.</p><p>Girma Ashetu</p></div>` });
    } catch { console.error('Contact acknowledgement unavailable.'); }
    return true;
  };
}
module.exports = { createContactNotifier, escapeHtml };
