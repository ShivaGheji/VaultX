import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { api } from "../../lib/api"
import { clearVaultKey, getAccessToken, getVaultKey, setVaultKey } from "../../lib/auth"
import { decryptVault, encryptVault, type VaultCredential, type VaultData } from "../../lib/crypto"

const VaultContext = createContext<null | {
  vault: VaultData
  setVault: (vault: VaultData) => void
  credential: VaultCredential | null
  setCredential: (credential: VaultCredential | null) => void
  saveVault: (vault: VaultData) => Promise<void>
  loadVault: () => Promise<VaultData>
  unlock: (key: CryptoKey) => Promise<VaultData>
  lock: () => void
}>(null)

export function VaultProvider({ children }: { children: ReactNode }) {
  const [vault, setVaultState] = useState<VaultData>({ version: 1, credentials: [] })
  const [credential, setCredential] = useState<VaultCredential | null>(null)

  const setVault = (next: VaultData) => setVaultState(next)
  const loadVault = async () => {
    const token = getAccessToken(); const key = getVaultKey()
    if (!token || !key) throw new Error("Vault is locked")
    const remote = await api.getVault(token)
    const decrypted = await decryptVault(remote.encrypted_data, key)
    setVaultState(decrypted)
    return decrypted
  }
  const saveVault = async (next: VaultData) => {
    const token = getAccessToken(); const key = getVaultKey()
    if (!token || !key) throw new Error("Vault is locked")
    const remote = await api.getVault(token)
    const encryptedData = await encryptVault(next, key)
    await api.updateVault({ encrypted_data: encryptedData, kdf_salt: remote.kdf_salt, kdf_algorithm: remote.kdf_algorithm, kdf_params: remote.kdf_params }, token)
    setVaultState(next)
  }
  const unlock = async (key: CryptoKey) => {
    const token = getAccessToken(); if (!token) throw new Error("Not authenticated")
    const remote = await api.getVault(token)
    const decrypted = await decryptVault(remote.encrypted_data, key)
    setVaultKey(key); setVaultState(decrypted); return decrypted
  }
  const lock = () => { clearVaultKey(); setCredential(null); setVaultState({ version: 1, credentials: [] }) }

  const value = useMemo(() => ({ vault, setVault, credential, setCredential, saveVault, loadVault, unlock, lock }), [vault, credential])
  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
}

export function useVault() { const value = useContext(VaultContext); if (!value) throw new Error("useVault must be used inside VaultProvider"); return value }
