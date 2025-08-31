"use client"

import useSWR from "swr"
import { readJSON, writeJSON, STORAGE_KEYS } from "@/lib/storage"
import type { ProfileInput } from "@/lib/types"

const fetcher = <T,>(key: string, fallback: T) =>
  Promise.resolve(readJSON<T>(key, fallback))

export function useAuth() {
  const { data: token, mutate, isLoading } = useSWR<string | null>(
    STORAGE_KEYS.AUTH,
    (k) => fetcher<string | null>(k, null),
    { fallbackData: null }
  )

  async function login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }


    const curr = readJSON<ProfileInput | null>(STORAGE_KEYS.PROFILE, null)
    writeJSON(STORAGE_KEYS.PROFILE, { ...(curr ?? {}), email } as ProfileInput)

    return { ok: true, user: { email }, otpSent: true }
  }

  async function verifyOtp(email: string, code: string) {
    if (!email) throw new Error("Missing email")

    if (code !== "123456") {
      throw new Error("Invalid OTP")
    }

    const fakeToken = "mock-token-" + Date.now()

    writeJSON(STORAGE_KEYS.AUTH, fakeToken)

    await mutate(fakeToken, false)
    return { ok: true, token: fakeToken, email }
  }

  async function logout() {
    writeJSON(STORAGE_KEYS.AUTH, null)
    await mutate(null, false)
  }

  const isAuthenticated = !!token

  return { isAuthenticated, login, verifyOtp, logout, isLoading }
}


// --- Profile Hook ---
export function useProfile() {
  const { data, mutate } = useSWR<ProfileInput | null>(
    STORAGE_KEYS.PROFILE,
    (k) => fetcher<ProfileInput | null>(k, null),
    { fallbackData: null }
  )

  const saveProfile = async (p: ProfileInput) => {
    writeJSON(STORAGE_KEYS.PROFILE, p)
    await mutate(p, false)
  }

  return { profile: data, saveProfile }
}
