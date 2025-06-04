import type { Auth } from '@/types/manage'

export function login(auth: Auth): Promise<void> {
  return fetch(`/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(auth),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error logging in: ${response.statusText}`)
    }
  })
}

export function logout(): Promise<void> {
  return fetch(`/api/logout`, {
    method: 'POST',
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error logging out: ${response.statusText}`)
    }
  })
}
