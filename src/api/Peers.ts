import type { PeerInfo } from '@/types/Peers'

export function listPeers(): Promise<PeerInfo[]> {
  return fetch(`/ztapi/peer`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error fetching node status: ${response.statusText}`)
    }
    return response.json()
  })
}

export function getJoinedNetworkByID(memberId: string): Promise<PeerInfo> {
  return fetch(`/ztapi/peer/${memberId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error fetching joined network by ID: ${response.statusText}`)
    }
    return response.json()
  })
}
