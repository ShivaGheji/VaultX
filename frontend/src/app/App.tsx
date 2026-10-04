import { AppProviders } from "./providers"
import { PrototypeApp } from "../features/prototype/PrototypeApp"

export default function App() {
  return (
    <AppProviders>
      <PrototypeApp />
    </AppProviders>
  )
}
