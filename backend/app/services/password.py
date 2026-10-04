import secrets
import string


def generate_password(
    length: int = 20,
    include_uppercase: bool = True,
    include_lowercase: bool = True,
    include_digits: bool = True,
    include_symbols: bool = True,
) -> str:
    character_sets = []

    if include_uppercase:
        character_sets.append(string.ascii_uppercase)

    if include_lowercase:
        character_sets.append(string.ascii_lowercase)

    if include_digits:
        character_sets.append(string.digits)

    if include_symbols:
        character_sets.append("!@#$%^&*()-_=+[]{}?")

    if not character_sets:
        raise ValueError("At least one character set must be enabled.")

    if length < len(character_sets):
        raise ValueError(
            f"Password length must be at least {len(character_sets)}."
        )

    password = [
        secrets.choice(character_set)
        for character_set in character_sets
    ]

    all_characters = "".join(character_sets)

    password.extend(
        secrets.choice(all_characters)
        for _ in range(length - len(password))
    )

    secrets.SystemRandom().shuffle(password)

    return "".join(password)