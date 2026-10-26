const DEVICE_ID_KEY = "a-una-milla:device-id"
let inMemoryDeviceId: string | undefined

function createDeviceId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function getOrCreateDeviceId() {
  if (typeof window === "undefined") {
    return "server"
  }

  try {
    const existingId = window.localStorage.getItem(DEVICE_ID_KEY)
    if (existingId) {
      inMemoryDeviceId = existingId
      return existingId
    }

    const deviceId = inMemoryDeviceId ?? createDeviceId()
    window.localStorage.setItem(DEVICE_ID_KEY, deviceId)
    inMemoryDeviceId = deviceId
    return deviceId
  } catch {
    inMemoryDeviceId ??= createDeviceId()
    return inMemoryDeviceId
  }
}
