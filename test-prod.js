import { spawn } from 'child_process';
import fetch from 'node-fetch';

const server = spawn('node', ['dist/server.js'], {
  env: { ...process.env, NODE_ENV: 'production', PORT: '3000' }
});

setTimeout(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 100, phone: "9876543210", email: 'test@t.com', name: 'Test' })
    });
    console.log('STATUS:', res.status);
    console.log('CONTENT-TYPE:', res.headers.get('content-type'));
    const text = await res.text();
    console.log('BODY:', text);
  } catch(e) {
    console.error(e);
  }
  server.kill();
}, 2000);

server.stdout.on('data', d => console.log('SERVER:', d.toString()));
server.stderr.on('data', d => console.error('SERVER ERR:', d.toString()));
