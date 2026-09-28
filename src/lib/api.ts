export type User = {
  id: string;
  name: string;
  email: string;
};

const API_BASE = '/api/auth';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  const text = await res.text();
  let data: any = text ? JSON.parse(text) : null;
  if (!res.ok) throw data || { message: res.statusText };
  return data;
}

export async function login(email: string, password: string) {
  const data = await request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  // backend may set httpOnly cookie; also return user and token optionally
  if (data.token) localStorage.setItem('token', data.token);
  return data as { user: User; token?: string };
}

export async function register(name: string, email: string, password: string) {
  const data = await request('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  if (data.token) localStorage.setItem('token', data.token);
  return data as { user: User; token?: string };
}

export async function logout() {
  try {
    await request('/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem('token');
  }
}

export async function getCurrentUser() {
  // try token from localStorage if present
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_BASE + '/me', {
    headers,
    credentials: 'include',
  });
  if (!res.ok) return null;
  return (await res.json()) as { user: User };
}

export default { login, register, logout, getCurrentUser };
