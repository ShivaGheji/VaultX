import { useState } from "react"
import { Icon, IconButton } from "../../../../components/ui/primitives"
import type { VaultCredential } from "../../../../lib/crypto"

export function LoginRow({ service, onView, onCopy, onDelete }: { service: VaultCredential; onView: () => void; onCopy: () => void; onDelete: () => void }) {
  const [menu, setMenu] = useState(false)
  const glyph = service.name.slice(0, 2).toUpperCase()
  const color = service.category === "Personal" ? "blue" : service.category === "Education" ? "amber" : "ink"
  return <div className="login-row" onClick={onView}><div className={`service-icon service-${color}`}>{glyph}</div><div className="login-main"><strong>{service.name}</strong><span>{service.username}</span></div><span className="tag">{service.category}</span><div className="row-actions" onClick={e => e.stopPropagation()}><IconButton icon="copy" label="Copy password" onClick={onCopy} /><IconButton icon="more" label="More actions" onClick={() => setMenu(v => !v)} />{menu && <div className="row-menu"><button onClick={onCopy}><Icon name="copy" />Copy username</button><button onClick={onCopy}><Icon name="key" />Copy password</button><button onClick={onView}><Icon name="eye" />View details</button><button onClick={onDelete}><Icon name="trash" />Delete</button></div>}</div></div>
}
