export type Screen = "welcome" | "signup" | "verify" | "master" | "login" | "login-verify" | "unlock" | "vault" | "generator" | "add" | "view" | "edit" | "security" | "reset" | "about"
export type ScreenNavigate = (screen: Screen) => void
