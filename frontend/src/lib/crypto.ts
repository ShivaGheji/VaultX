import { argon2id } from "hash-wasm"

export const DEFAULT_KDF_PARAMS = { time_cost: 3, memory_cost: 65536, parallelism: 1, hash_length: 32 }
export type VaultCredential = { id: string; name: string; website: string; username: string; password: string; category: "Developer" | "Personal" | "Work" | "Education" }
export type VaultData = { version: 1; credentials: VaultCredential[] }

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer { const buffer = new ArrayBuffer(bytes.byteLength); new Uint8Array(buffer).set(bytes); return buffer }
function toBase64(bytes: Uint8Array) { let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary) }
function fromBase64(value: string) { const binary = atob(value); return Uint8Array.from(binary, c => c.charCodeAt(0)) }

export async function deriveVaultKey(
  masterPassword: string,
  salt: Uint8Array,
  params: Record<string, unknown> = DEFAULT_KDF_PARAMS,
) {
  const hash = await argon2id({ password: masterPassword, salt, iterations: Number(params.time_cost ?? 3), memorySize: Number(params.memory_cost ?? 65536), parallelism: Number(params.parallelism ?? 1), hashLength: Number(params.hash_length ?? 32), outputType: "binary" })
  return crypto.subtle.importKey("raw", toArrayBuffer(hash), { name: "AES-GCM" }, false, ["encrypt", "decrypt"])
}
export function generateVaultSalt() { return crypto.getRandomValues(new Uint8Array(16)) }
export function createEmptyVault(): VaultData { return { version: 1, credentials: [] } }
export function metadataForSalt(salt: Uint8Array) { return { kdf_salt: toBase64(salt), kdf_algorithm: "argon2id", kdf_params: DEFAULT_KDF_PARAMS } }
export function decodeSalt(value: string) { return fromBase64(value) }
export async function encryptVault(vault: VaultData, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: toArrayBuffer(iv) }, key, toArrayBuffer(new TextEncoder().encode(JSON.stringify(vault))))
  return JSON.stringify({ iv: toBase64(iv), ciphertext: toBase64(new Uint8Array(ciphertext)) })
}
export async function decryptVault(encryptedData: string, key: CryptoKey): Promise<VaultData> {
  const payload = JSON.parse(encryptedData) as { iv: string; ciphertext: string }
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: toArrayBuffer(fromBase64(payload.iv)) }, key, toArrayBuffer(fromBase64(payload.ciphertext)))
  const vault = JSON.parse(new TextDecoder().decode(new Uint8Array(plaintext))) as VaultData
  if (vault.version !== 1 || !Array.isArray(vault.credentials)) throw new Error("Invalid vault format")
  return vault
}
export async function reencryptVault(vault: VaultData, newMasterPassword: string) {
  const salt = generateVaultSalt()
  const key = await deriveVaultKey(newMasterPassword, salt)
  return { key, encryptedData: await encryptVault(vault, key), ...metadataForSalt(salt) }
}
