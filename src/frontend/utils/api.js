export async function api(path, options = {}) {
  const token = localStorage.getItem('trustbridge_token');
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Request failed');
  return payload;
}

export const money = value => `INR ${Number(value || 0).toLocaleString('en-IN')}`;

export function quotePayload(form) {
  return {
    productId: form.productId,
    age: Number(form.age),
    coverage: Number(form.coverage),
    riskScore: Number(form.riskScore),
    priorClaims: Number(form.priorClaims),
    tenureYears: Number(form.tenureYears)
  };
}
