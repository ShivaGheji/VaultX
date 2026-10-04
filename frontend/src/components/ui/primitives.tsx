import { useState } from "react"
import type { ReactNode } from "react"

export type IconName = "shield" | "arrow" | "github" | "linkedin" | "twitter" | "mail" | "eye" | "eyeOff" | "check" | "search" | "plus" | "copy" | "more" | "spark" | "lock" | "logout" | "moon" | "sun" | "info" | "key" | "settings" | "trash" | "edit" | "chevron" | "globe" | "refresh" | "alert" | "health" | "x"

const paths: Record<IconName, ReactNode> = {
  shield: (
    <path d="M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6l-7-3Zm-3 9 2 2 4-4" />
  ),
  arrow: <path d="m9 18 6-6-6-6" />,
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.2 15 1.8a13.4 13.4 0 0 0-6 0C5.8.2 4.7.5 4.7.5A5 5 0 0 0 4.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.3 3.5 6.5 6.8 6.9A4.8 4.8 0 0 0 9 18v4" />
      <path d="M9 18c-5 .8-5-2-7-2" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-7M12 13a4 4 0 0 1 7 2.5V17" />
    </>
  ),
  twitter: (
    <path d="M22 5.8c-.7.3-1.5.5-2.3.6a4 4 0 0 0 1.8-2.2c-.8.5-1.7.8-2.6 1A4 4 0 0 0 12 8.9c-3.3-.2-6.2-1.7-8.2-4.2a4 4 0 0 0 1.2 5.4c-.7 0-1.3-.2-1.8-.5 0 2 1.4 3.7 3.3 4.1-.6.2-1.2.2-1.8.1.5 1.6 2 2.8 3.8 2.8A8.1 8.1 0 0 1 3.5 18c-.5 0-1 0-1.5-.1A11.4 11.4 0 0 0 8.2 20c7.4 0 11.5-6.2 11.5-11.5v-.5c.8-.6 1.5-1.3 2-2.1Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  eyeOff: (
    <>
      <path d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.5 10.5 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-2.1 3M6.6 6.6C3.6 8.4 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 3.4-.6" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  copy: (
    <>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
    </>
  ),
  spark: (
    <path d="m12 3-1.2 4.8L6 9l4.8 1.2L12 15l1.2-4.8L18 9l-4.8-1.2L12 3ZM5 15l-.7 2.3L2 18l2.3.7L5 21l.7-2.3L8 18l-2.3-.7L5 15Zm14-2-.7 2.3-2.3.7 2.3.7L19 19l.7-2.3L22 16l-2.3-.7L19 13Z" />
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </>
  ),
  logout: (
    <>
      <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M14 8l4 4-4 4M18 12H9" />
    </>
  ),
  moon: <path d="M20.5 15.5A8 8 0 0 1 8.5 3.5a9 9 0 1 0 12 12Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8-8M15 8l2 2M17 6l2 2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 7v5h-5M4 17v-5h5" />
      <path d="M6.1 8A7 7 0 0 1 18 6l2 6M17.9 16A7 7 0 0 1 6 18l-2-6" />
    </>
  ),
  alert: (
    <>
      <path d="M10.3 4.2 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  health: (
    <>
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      <path d="M7 12h3l1-3 2 6 1-3h3" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6 6 18" />,
}

type IconProps = {
  name: IconName
  size?: number
}

export function Icon({ name, size = 18 }: IconProps) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

export function Logo({ large = false }: { large?: boolean }) {
  return (
    <svg
      className={`logo ${large ? "logo-large" : ""}`}
      viewBox="0 0 40 40"
      role="img"
      aria-label="VaultX logo"
    >
      <rect x="1" y="1" width="38" height="38" rx="11" fill="currentColor" />
      <circle
        cx="20"
        cy="20"
        r="10.5"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
      />
      <path
        d="M20 9.5v3M20 27.5v3M9.5 20h3M27.5 20h3"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="19" r="2.6" fill="white" />
      <path
        d="M18.4 21h3.2l1.2 5h-5.6l1.2-5Z"
        fill="white"
        stroke="currentColor"
        strokeWidth=".7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Button({
  children,
  icon,
  variant = "primary",
  onClick,
  type = "button",
  full = false,
  disabled = false,
}: {
  children: ReactNode
  icon?: IconName
  variant?: "primary" | "secondary" | "ghost" | "danger"
  onClick?: () => void
  type?: "button" | "submit"
  full?: boolean
  disabled?: boolean
}) {
  return (
    <button
      className={`btn btn-${variant} ${full ? "btn-full" : ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  )
}

export function IconButton({
  icon,
  label,
  onClick,
  active = false,
}: {
  icon: IconName
  label: string
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button
      className={`icon-btn ${active ? "active" : ""}`}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <Icon name={icon} />
    </button>
  )
}

export function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  icon,
  action,
  hint,
  error,
  required = false,
}: {
  label: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (value: string) => void
  icon?: IconName
  action?: ReactNode
  hint?: string
  error?: string
  required?: boolean
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className={`input-wrap ${error ? "input-error" : ""}`}>
        {icon && <Icon name={icon} />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
        />
        {action}
      </span>
      {error && (
        <span className="field-error">
          <Icon name="alert" size={14} />
          {error}
        </span>
      )}
      {hint && !error && <span className="field-hint">{hint}</span>}
    </label>
  )
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder = "Enter your password",
}: {
  label: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <Field
      label={label}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      icon="lock"
      action={
        <IconButton
          icon={show ? "eyeOff" : "eye"}
          label={show ? "Hide password" : "Show password"}
          onClick={() => setShow(!show)}
        />
      }
    />
  )
}

export function AuthShell({
  eyebrow,
  title,
  text,
  children,
  back,
}: {
  eyebrow?: string
  title: string
  text: string
  children: ReactNode
  back?: () => void
}) {
  return (
    <div className="auth-shell">
      {back && (
        <button className="back-link" onClick={back}>
          ← Back
        </button>
      )}
      <div className="auth-copy">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {children}
    </div>
  )
}

export function Strength() {
  return (
    <div className="strength">
      <div className="strength-top">
        <span>Password strength</span>
        <strong>Strong</strong>
      </div>
      <div className="strength-bars">
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}
