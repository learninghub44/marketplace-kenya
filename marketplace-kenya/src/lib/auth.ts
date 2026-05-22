// Central auth helpers used across all pages
export const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('km_token') : null
export const getUser = () => {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem('km_user') || 'null') } catch { return null }
}
export const setAuth = (token: string, user: any) => {
  localStorage.setItem('km_token', token)
  localStorage.setItem('km_user', JSON.stringify(user))
}
export const clearAuth = () => {
  localStorage.removeItem('km_token')
  localStorage.removeItem('km_user')
}
export const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` })
