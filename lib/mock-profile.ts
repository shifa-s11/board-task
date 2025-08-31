export type Profile = {
  name?: string
  email?: string
  avatarUrl?: string
  bio?: string
}

let PROFILE: Profile | null = null


export function getProfile(): Profile | null {
  return PROFILE ? { ...PROFILE } : null
}

export function setProfile(p: Profile | null) {
  PROFILE = p ? { ...p } : null
}


export function exportProfile(): Profile | null {
  return PROFILE ? { ...PROFILE } : null
}

export function importProfile(p: Profile | null) {
  setProfile(p)
}
