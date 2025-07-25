const BASE_URL = 'http://localhost:3000';
 const EVIDENCE_URL = 'http://localhost:4000';
 

export async function getCrimes() {
  const res = await fetch(`${BASE_URL}/api/crimes`);
  if (!res.ok) throw new Error('Failed to load crimes');
  return res.json();
}

export async function createCrime(data) {
  const res = await fetch(`${BASE_URL}/api/crimes`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create crime');
  return res.json();
}

export async function resolveCrime(id) {
  const res = await fetch(`${BASE_URL}/api/crimes/${id}/resolve`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to resolve crime');
  return res.json();
}

export async function escalateCrime(id, reason) {
  const res = await fetch(`${BASE_URL}/api/crimes/${id}/escalate`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({reason})
  });
  if (!res.ok) throw new Error('Failed to escalate crime');
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${BASE_URL}/api/stats`);
  if (!res.ok) throw new Error('Failed to load stats');
  return res.json();
}
 
