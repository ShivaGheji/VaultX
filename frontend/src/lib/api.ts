const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1"

export class ApiRequestError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = "ApiRequestError"
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  const text = await response.text()
  let data: unknown = null
  if (text) {
    try { data = JSON.parse(text) } catch { data = text }
  }
  if (!response.ok) {
    const detail = typeof data === "object" && data !== null && "detail" in data ? String((data as { detail: unknown }).detail) : undefined
    throw new ApiRequestError(detail ?? (typeof data === "string" ? data : "Request failed"), response.status)
  }
  return data as T
}

export type MessageResponse = { message: string }
export type AuthResponse = { message?: string; access_token: string; token_type: string }
export type VaultResponse = {
  encrypted_data: string
  kdf_salt: string
  kdf_algorithm: string
  kdf_params: Record<string, unknown>
  version: number
}
export type MeResponse = { id: number; email: string; is_verified: boolean }

export const api = {
  signup: (email: string) => request<MessageResponse>("/auth/signup", { method: "POST", body: JSON.stringify({ email }) }),
  verifySignup: (email: string, code: string) => request<AuthResponse>("/auth/signup/verify", { method: "POST", body: JSON.stringify({ email, code }) }),
  login: (email: string) => request<MessageResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email }) }),
  verifyLogin: (email: string, code: string) => request<AuthResponse>("/auth/login/verify", { method: "POST", body: JSON.stringify({ email, code }) }),
  me: (token: string) => request<MeResponse>("/auth/me", {}, token),
  logout: (token: string) => request<MessageResponse>("/auth/logout", { method: "POST" }, token),
  createVault: (payload: Omit<VaultResponse, "version">, token: string) => request<VaultResponse>("/vault", { method: "POST", body: JSON.stringify(payload) }, token),
  getVault: (token: string) => request<VaultResponse>("/vault", {}, token),
  updateVault: (payload: Omit<VaultResponse, "version">, token: string) => request<VaultResponse>("/vault", { method: "PUT", body: JSON.stringify(payload) }, token),
  generatePassword: (payload: { length: number; uppercase: boolean; lowercase: boolean; digits: boolean; symbols: boolean }, token?: string) => request<{ password: string }>("/password/generate", { method: "POST", body: JSON.stringify(payload) }, token),
}
