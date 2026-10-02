const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw { message: 'Cannot reach the server. Check that the API is running.' };
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { message: data.message || 'Request failed', errors: data.errors || {} };
  return data;
}

export const listEmployees = ({ search = '', department = '' } = {}) => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (department) params.set('department', department);
  const qs = params.toString();
  return request(`/employees${qs ? `?${qs}` : ''}`);
};

export const createEmployee = (body) => request('/employees', { method: 'POST', body: JSON.stringify(body) });
export const updateEmployee = (id, body) => request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteEmployee = (id) => request(`/employees/${id}`, { method: 'DELETE' });
