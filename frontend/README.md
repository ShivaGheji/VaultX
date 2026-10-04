# VaultX Frontend

Final hackathon frontend for VaultX Password Manager.

## Stack
- React + TypeScript + Vite
- React Router
- Argon2id via `hash-wasm`
- Web Crypto API / AES-256-GCM
- FastAPI backend

## Fresh setup
```bash
mkdir -p ~/Downloads/hackathon/VaultX-frontend
cd ~/Downloads/hackathon/VaultX-frontend
# extract the provided archive here
corepack pnpm@10.34.3 install
cp .env.example .env
corepack pnpm@10.34.3 typecheck
corepack pnpm@10.34.3 build
corepack pnpm@10.34.3 dev
```

Frontend runs on `http://127.0.0.1:8443`.
Backend expected at `http://127.0.0.1:8000`.

## Security model
- Account authentication uses email + OTP.
- The Master Password never goes to FastAPI.
- Argon2id derives a 256-bit AES key in the browser.
- Vault contents are encrypted with AES-256-GCM before upload.
- Backend stores only encrypted vault data and KDF metadata.
- JWT is kept in `sessionStorage` for the hackathon MVP.
- Derived vault key exists only in memory and is cleared on lock/logout.

## Backend requirement
`POST /api/v1/auth/signup/verify` must return an access token in the same shape as login verification:
```json
{"message":"Email verified successfully","access_token":"...","token_type":"bearer"}
```

## Git plan
Use three meaningful commits:
```bash
git add . && git commit -m "feat: add frontend foundation"
git add . && git commit -m "feat: connect auth and encrypted vault"
git add . && git commit -m "feat: finish generator security and polish"
```
