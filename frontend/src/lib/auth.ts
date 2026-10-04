const TOKEN_KEY = "vaultx_access_token"
const EMAIL_KEY = "vaultx_pending_email"
let vaultKey: CryptoKey | null = null

export function setAccessToken(token: string) { sessionStorage.setItem(TOKEN_KEY, token) }
export function getAccessToken() { return sessionStorage.getItem(TOKEN_KEY) }
export function clearAccessToken() { sessionStorage.removeItem(TOKEN_KEY) }
export function setPendingEmail(email: string) { sessionStorage.setItem(EMAIL_KEY, email) }
export function getPendingEmail() { return sessionStorage.getItem(EMAIL_KEY) ?? "" }
export function clearPendingEmail() { sessionStorage.removeItem(EMAIL_KEY) }
export function setVaultKey(key: CryptoKey) { vaultKey = key }
export function getVaultKey() { return vaultKey }
export function clearVaultKey() { vaultKey = null }
export function clearAuth() { clearAccessToken(); clearPendingEmail(); clearVaultKey() }
