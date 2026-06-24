const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });
const jwt = require('jsonwebtoken');

async function test() {
  try {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'secret');
    const res = await axios.get('http://localhost:5001/api/admin/messages', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('--- API MESSAGES ---');
    console.log('Count:', res.data.length);
    console.log('First:', res.data[0]);
    process.exit(0);
  } catch (err) {
    console.error('❌ API ERROR:', err.message);
    process.exit(1);
  }
}
test();
