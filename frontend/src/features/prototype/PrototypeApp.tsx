import { useState } from "react"
import { useLocation, useNavigate, useRoutes } from "react-router-dom"
import { routes, screenFromPath, screenPaths } from "../../app/routes"
import { AccountMenu, AppLayout, Header, Modal, Toast } from "../../components/layout/AppLayout"
import { Button, Icon } from "../../components/ui/primitives"
import { About, Reset } from "../settings/pages/SettingsPages"
import { GeneratorPage } from "../generator/pages/GeneratorPage"
import { Security } from "../security/pages/SecurityPage"
import { Login, LoginVerify, Master, Signup, Unlock, Verify, Welcome } from "../auth/pages/AuthPages"
import { CredentialForm, Vault, ViewLogin } from "../vault/pages/VaultPages"
import { useVault } from "../vault/VaultContext"
import type { Screen } from "../../types/navigation"
import { api } from "../../lib/api"
import { clearAuth, getAccessToken } from "../../lib/auth"

export function PrototypeApp() {
  const location = useLocation(); const routerNavigate = useNavigate(); const screen = screenFromPath(location.pathname); const [dark, setDark] = useState(false); const [menu, setMenu] = useState(false); const [deleteId, setDeleteId] = useState<string | null>(null); const [toastMessage, setToastMessage] = useState(""); const { vault, setVault, credential, setCredential, lock } = useVault()
  const authScreens: Screen[] = ["welcome", "signup", "verify", "master", "login", "login-verify", "unlock"]
  const toast = (message: string) => { setToastMessage(message); window.setTimeout(() => setToastMessage(""), 2600) }
  const navigate = (next: Screen) => { routerNavigate(screenPaths[next]); setMenu(false) }
  async function logout() { const token = getAccessToken(); try { if (token) await api.logout(token) } finally { clearAuth(); lock(); navigate("login") } }
  async function deleteCredential() { if (!deleteId) return; const next = vault.credentials.filter(c => c.id !== deleteId); setVault({ version: 1, credentials: next }); setDeleteId(null); setCredential(null); try { const token = getAccessToken(); const { getVaultKey } = await import("../../lib/auth"); const key = getVaultKey(); if (token && key) { const { encryptVault } = await import("../../lib/crypto"); const remote = await api.getVault(token); await api.updateVault({ encrypted_data: await encryptVault({ version: 1, credentials: next }, key), kdf_salt: remote.kdf_salt, kdf_algorithm: remote.kdf_algorithm, kdf_params: remote.kdf_params }, token) } toast("Login deleted") } catch { toast("Deleted locally; sync failed") } }
  function renderScreen(current: Screen) { switch (current) { case "welcome": return <Welcome next={() => navigate("signup")} login={() => navigate("login")} />; case "signup": return <Signup navigate={navigate} />; case "verify": return <Verify navigate={navigate} />; case "master": return <Master navigate={navigate} />; case "login": return <Login navigate={navigate} />; case "login-verify": return <LoginVerify navigate={navigate} />; case "unlock": return <Unlock navigate={navigate} onUnlocked={() => {}} />; case "vault": return <Vault navigate={navigate} toast={toast} setDelete={setDeleteId} />; case "generator": return <GeneratorPage toast={toast} />; case "add": return <CredentialForm navigate={navigate} toast={toast} />; case "view": return <ViewLogin navigate={navigate} toast={toast} setDelete={() => setDeleteId(credential?.id ?? null)} />; case "edit": return <CredentialForm edit navigate={navigate} toast={toast} />; case "security": return <Security navigate={navigate} />; case "reset": return <Reset navigate={navigate} toast={toast} />; case "about": return <About navigate={navigate} /> } }
  const content = useRoutes([...routes.map(r => ({ path: r.path, element: renderScreen(r.screen) })), { path: "*", element: <Welcome next={() => navigate("signup")} login={() => navigate("login")} /> }])
  const currentEmail = sessionStorage.getItem("vaultx_pending_email") ?? ""
  return <div className={dark ? "theme-dark" : ""}><div className={`stage ${authScreens.includes(screen) ? "stage-auth" : ""}`}><div className="extension-root">{authScreens.includes(screen) ? <div className="extension-frame"><Header authenticated={false} /><div className="auth-content">{content}</div></div> : <AppLayout screen={screen} navigate={navigate} onAvatar={() => setMenu(v => !v)} email={currentEmail} onLogout={logout} onLock={() => { lock(); navigate("unlock") }}>{content}</AppLayout>}{menu && <AccountMenu onClose={() => setMenu(false)} navigate={navigate} dark={dark} setDark={setDark} email={currentEmail} onLogout={logout} onLock={() => { lock(); navigate("unlock") }} />}{toastMessage && <Toast message={toastMessage} />}{deleteId && <Modal onClose={() => setDeleteId(null)}><div className="modal-icon danger"><Icon name="trash" /></div><h2>Delete this login?</h2><p>This credential will be permanently removed from your vault. This action cannot be undone.</p><div className="modal-actions"><Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button><Button variant="danger" onClick={() => void deleteCredential()}>Delete Login</Button></div></Modal>}</div></div></div>
}
