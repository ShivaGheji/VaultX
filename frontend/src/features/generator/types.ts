export type CharacterGroup = "Uppercase" | "Lowercase" | "Numbers" | "Symbols"

export type GeneratorOptions = Record<CharacterGroup, boolean>

export type PasswordStrength = "Weak" | "Fair" | "Strong" | "Very strong"
