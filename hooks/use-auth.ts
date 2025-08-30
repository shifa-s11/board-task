"use client"
import useSWR from "swr"
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage"
import type { ProfileInput } from "@/lib/types"
import axios from "axios"

const fetcher = <T,>(key: string, fallback: T) => Promise.resolve(readJSON<T>(key, fallback))

export function useAuth() {

  const { data: token, mutate } = useSWR<string | null>(STORAGE_KEYS.AUTH, (k) => fetcher<string | null>(k, null), {
    fallbackData: null,
  })

  async function login(email: string, password: string) {
    try {
      const res = await axios.post("/api/auth/login", { email, password })

      const data = res.data

      writeJSON(STORAGE_KEYS.AUTH, data.token)
      const curr = readJSON<ProfileInput | null>(STORAGE_KEYS.PROFILE, null)
      writeJSON(STORAGE_KEYS.PROFILE, { ...(curr ?? {}), email } as ProfileInput)
      await mutate(data.token, false) 

      return data as { ok: true; token: string; user: { id: string; email: string } }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed")
    }
  }

  const logout = async () => {
    writeJSON(STORAGE_KEYS.AUTH, null)
    await mutate(null, false)
  }

//   async function verifyOtp(email: string, code: string) {
//     try {
//       const res = await axios.post("/api/auth/otp", { email, code })
//       return res.data as { ok: true; email: string }
//     } catch (error: any) {
//       throw new Error(error.response?.data?.error || "OTP verification failed")
//     }
//   }

//   const isAuthenticated = !!token

//   return { isAuthenticated, logout, login, verifyOtp }
// }

  async function verifyOtp(email: string, code: string) {
    try {
      const res = await axios.post("/api/auth/otp", { email, code })
      writeJSON(STORAGE_KEYS.AUTH, res.data.token);
      await mutate(res.data.token, false);
      return res.data as { ok: true; email: string }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "OTP verification failed")
    }
  }

  const isAuthenticated = !!token

  return { isAuthenticated, logout, login, verifyOtp }
}

export function useProfile() {
  const { data, mutate } = useSWR<ProfileInput | null>(
    STORAGE_KEYS.PROFILE,
    (k) => fetcher<ProfileInput | null>(k, null),
    { fallbackData: null },
  )

  const saveProfile = async (p: ProfileInput) => {
    writeJSON(STORAGE_KEYS.PROFILE, p)
    await mutate(p, false)
  }

  return { profile: data, saveProfile }
}
