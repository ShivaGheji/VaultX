import type { Screen } from "../types/navigation"
export const screenPaths: Record<Screen, string> = { welcome: "/welcome", signup: "/signup", verify: "/verify", master: "/master-password", login: "/login", "login-verify": "/login/verify", unlock: "/unlock", vault: "/vault", generator: "/generator", add: "/vault/add", view: "/vault/view", edit: "/vault/edit", security: "/security", reset: "/reset-password", about: "/about" }
type ScreenRoute = { path: string; screen: Screen }
export const routes: ScreenRoute[] = Object.entries(screenPaths).map(([screen, path]) => ({ screen: screen as Screen, path }))
export function screenFromPath(pathname: string): Screen { return routes.find(route => route.path === pathname)?.screen ?? "welcome" }
