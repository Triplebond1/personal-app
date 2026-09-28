import  api  from './api'



export type Credentials = { email: string; password: string }

// Get current api state (user/session) from backend
export async function getAuth() {
  return api('/api')
}

// Login with credentials; returns whatever the API responds with (token/user)
export async function login(creds: Credentials) {
  const res: any = await api('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  })
  // If response contains token, persist it
  try {
    if (res && res.token) localStorage.setItem('token', res.token)
  } catch {}
  return res
}

export async function logout() {
  try {
    await api('/api/logout', { method: 'POST' })
  } catch {}
  try {
    localStorage.removeItem('token')
  } catch {}
}

export function getToken(): string | null {
  try {
    return localStorage.getItem('token')
  } catch {
    return null
  }
}

export function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = getToken()
  const headers = new Headers(init.headers || {})
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(input, { ...init, headers })
}

export default { getAuth, login, logout, getToken, authFetch }
