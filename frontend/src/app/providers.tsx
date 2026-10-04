import type { ReactNode } from "react"
import { BrowserRouter } from "react-router-dom"
import { VaultProvider } from "../features/vault/VaultContext"

export function AppProviders({ children }: { children: ReactNode }) {
  return <BrowserRouter><VaultProvider>{children}</VaultProvider></BrowserRouter>
}
