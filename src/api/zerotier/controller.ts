import type {
  ControllerNetworkInfo,
  ControllerStatusInfo,
  Members,
  ControllerNetworkMemberInfo,
  ControllerNetworkMemberSettings,
} from '@/types/zerotier/controller'

export function controllerStatus(): Promise<ControllerStatusInfo> {
  return fetch(`/ztapi/controller`, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error fetching controller status: ${response.statusText}`)
    }
    return response.json()
  })
}

export function listNetworkIDs(): Promise<string[]> {
  return fetch(`/ztapi/controller/network`, {
    method: 'GET',
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error fetching network IDs: ${response.statusText}`)
    }
    return response.json()
  })
}

export function generateRandomNetworkID(): Promise<ControllerNetworkInfo> {
  return fetch(`/ztapi/controller/network`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error fetching network IDs: ${response.statusText}`)
    }
    return response.json()
  })
}

export function getNetworkByID(networkId: string): Promise<ControllerNetworkInfo> {
  return fetch(`/ztapi/controller/network/${networkId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error fetching network by ID: ${response.statusText}`)
    }
    return response.json()
  })
}

export function createOrUpdateNetwork(
  networkId: string,
  controllerinfo: ControllerNetworkInfo,
): Promise<ControllerNetworkInfo> {
  return fetch(`/ztapi/controller/network/${networkId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(controllerinfo),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error creating or updating network: ${response.statusText}`)
    }
    return response.json()
  })
}

export function deleteNetwork(networkId: string): Promise<void> {
  return fetch(`/ztapi/controller/network/${networkId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error deleting network: ${response.statusText}`)
    }
  })
}

export function listNetworkMemberIDs(networkId: string): Promise<Members> {
  return fetch(`/ztapi/controller/network/${networkId}/member`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error fetching network member IDs: ${response.statusText}`)
    }
    return response.json()
  })
}

export function getNetworkMemberByID(
  networkId: string,
  memberId: string,
): Promise<ControllerNetworkMemberInfo> {
  return fetch(`/ztapi/controller/network/${networkId}/member/${memberId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error fetching network member by ID: ${response.statusText}`)
    }
    return response.json()
  })
}

export function createOrUpdateNetworkMember(
  networkId: string,
  memberId: string,
  memberSettings: ControllerNetworkMemberSettings,
): Promise<ControllerNetworkMemberInfo> {
  return fetch(`/ztapi/controller/network/${networkId}/member/${memberId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberSettings),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error creating or updating network member: ${response.statusText}`)
    }
    return response.json()
  })
}

export function deleteNetworkMember(
  networkId: string,
  memberId: string,
): Promise<ControllerNetworkMemberInfo> {
  return fetch(`/ztapi/controller/network/${networkId}/member/${memberId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error deleting network member: ${response.statusText}`)
    }
    return response.json()
  })
}
