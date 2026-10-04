# VaultX

Secure password management tool built for a college hackathon.

## Features

- Email OTP authentication
- JWT-based sessions
- Client-side vault encryption
- Argon2id key derivation
- AES-256-GCM encryption
- Secure password generator
- Encrypted vault storage
- Vault lock/logout
- Password security health
- FastAPI backend
- React frontend

## Project Structure

```text
VaultX/
├── frontend/   # React + Vite frontend
└── backend/    # FastAPI backend
```

## Security
- The master password is never sent to the backend.
- ault data is encrypted client-side before being stored by the backend.

## Team
- The Unlockers
