import { useEffect, useState } from "react"
import { api } from "../../../lib/api"
import { getAccessToken } from "../../../lib/auth"
import type { CharacterGroup, GeneratorOptions, PasswordStrength } from "../types"

export function usePasswordGenerator() {
  const [length, setLength] = useState(20)
  const [visible, setVisible] = useState(true)
  const [options, setOptions] = useState<GeneratorOptions>({ Uppercase: true, Lowercase: true, Numbers: true, Symbols: true })
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function regenerate() {
    setLoading(true)
    try {
      const response = await api.generatePassword({ length, uppercase: options.Uppercase, lowercase: options.Lowercase, digits: options.Numbers, symbols: options.Symbols }, getAccessToken() ?? undefined)
      setPassword(response.password)
    } finally { setLoading(false) }
  }
  useEffect(() => { void regenerate() }, [length, options])
  function toggleOption(option: CharacterGroup) { if (options[option] && Object.values(options).filter(Boolean).length === 1) return; setOptions(prev => ({ ...prev, [option]: !prev[option] })) }
  const strength: PasswordStrength = length < 10 ? "Weak" : length < 14 ? "Fair" : length < 18 ? "Strong" : "Very strong"
  return { length, setLength, visible, setVisible, options, password, strength, strengthClass: strength.toLowerCase().replace(" ", "-"), toggleOption, regenerate, loading }
}
