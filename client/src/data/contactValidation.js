export function validateContact(form) {
  const errors = {};
  const name = String(form.name || '').trim();
  const email = String(form.email || '').trim();
  const message = String(form.message || '').trim();
  if (!name) errors.name = 'Enter your name.';
  else if (name.length > 120) errors.name = 'Use 120 characters or fewer.';
  if (!email) errors.email = 'Enter your email address.';
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email, such as you@example.com.';
  if (message.length < 10) errors.message = 'Include at least 10 characters in your message.';
  else if (message.length > 10000) errors.message = 'Use 10,000 characters or fewer.';
  return errors;
}
