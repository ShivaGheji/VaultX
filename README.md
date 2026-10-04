# 🔐 VaultX

### Secure. Simple. Private.

**VaultX** is a modern password management tool designed to securely generate, store, organize, and retrieve passwords for different accounts.

Built for a college hackathon by **The Unlockers**, VaultX focuses on a security-first architecture where the user's **master password never leaves the client** and the vault is encrypted before it reaches the backend.

---

## ✨ Why VaultX?

Managing multiple strong passwords is difficult.

Reusing passwords creates security risks, while remembering dozens of unique passwords is impractical.

VaultX solves this by providing a secure vault where users can:

- 🔑 Generate strong, unique passwords
- 🗄️ Store credentials in an encrypted vault
- 🔍 Search and organize saved credentials
- 🔒 Lock the vault instantly
- 📧 Authenticate using email OTP
- 🛡️ Check password security health
- 🔄 Change/reset the master password
- 🚪 Securely logout and revoke sessions

The most important design principle:

> **The backend never receives the user's master password or plaintext vault credentials.**

---

# 🚀 Features

## 🔐 Secure Authentication

- Email-based authentication
- One-time password (OTP) verification
- Secure 6-digit OTP generation
- OTP expiration
- OTP attempt limits
- OTP resend cooldown
- JWT-based sessions
- Server-side session revocation
- Secure logout

---

## 🛡️ Client-Side Vault Encryption

VaultX uses a zero-knowledge-inspired architecture for vault data.

The master password is used **locally on the user's device** to derive an encryption key.

```text
Master Password
       │
       ▼
    Argon2id
       │
       ▼
   256-bit Key
       │
       ▼
   AES-256-GCM
       │
       ▼
 Encrypted Vault
       │
       ▼
     Backend
```

The backend stores encrypted vault data rather than individual plaintext passwords.

### Encryption

- **KDF:** Argon2id
- **Encryption:** AES-256-GCM
- **Salt:** Random per vault
- **Key:** Derived locally from the master password
- **Master password:** Never sent to the backend

---

## 🔑 Password Generator

Generate strong passwords using cryptographically secure randomness.

Supports:

- Custom password length
- Uppercase letters
- Lowercase letters
- Numbers
- Symbols
- Guaranteed inclusion of selected character categories

Password generation uses secure randomness rather than predictable pseudo-random generation.

---

## 🗄️ Encrypted Password Vault

Store credentials for different services in a single encrypted vault.

Each credential can contain information such as:

- Website / service
- Username / email
- Password
- Notes
- Other credential metadata

The entire vault is encrypted before being sent to the backend.

---

## 🔒 Vault Lock

Lock the vault whenever you leave the application.

When locked:

- The in-memory encryption key is cleared.
- Vault contents cannot be accessed.
- The master password is required again to unlock the vault.

---

## 🚪 Secure Logout

Logging out does more than remove the frontend token.

The backend maintains server-side sessions and can revoke the associated session token.

```text
Logout
  │
  ▼
JWT Session Revoked
  │
  ▼
Frontend Token Cleared
  │
  ▼
Vault Key Cleared
```

---

## 🛡️ Security Health

VaultX can analyze the decrypted vault locally and provide a security overview.

The security dashboard can help identify issues such as:

- Weak passwords
- Reused passwords
- Password strength
- Overall vault security

---

## 🔄 Master Password Reset

VaultX supports changing the master password.

The process is designed around re-encrypting the existing vault:

```text
Old Master Password
        │
        ▼
   Decrypt Vault
        │
        ▼
   New Master Password
        │
        ▼
     Argon2id
        │
        ▼
 New Encryption Key
        │
        ▼
 Re-encrypt Vault
        │
        ▼
   Store Ciphertext
```

The plaintext vault is not sent to the backend during this process.

---

# 🏗️ Architecture

VaultX is split into two major components:

```text
                    ┌──────────────────────┐
                    │      VaultX UI       │
                    │   React + TypeScript │
                    └──────────┬───────────┘
                               │
                         HTTPS / API
                               │
              ┌────────────────▼────────────────┐
              │          FastAPI API            │
              │                                 │
              │  Authentication                 │
              │  JWT Sessions                   │
              │  OTP Management                 │
              │  Encrypted Vault Storage       │
              │  Password Generator             │
              └────────────────┬────────────────┘
                               │
                         SQLAlchemy
                               │
                    ┌──────────▼──────────┐
                    │       SQLite        │
                    │                     │
                    │ Users               │
                    │ OTPs                │
                    │ Sessions            │
                    │ Encrypted Vault     │
                    └─────────────────────┘
```

### Important security boundary

The backend stores:

```text
✓ Encrypted vault
✓ KDF salt
✓ KDF parameters
✓ Authentication/session information
```

The backend does **not** receive:

```text
✗ Master password
✗ Plaintext vault passwords
✗ Plaintext vault credentials
```

---

# 🔄 Application Flow

## New User

```text
Sign Up
   │
   ▼
Enter Email
   │
   ▼
OTP Verification
   │
   ▼
Create Master Password
   │
   ▼
Generate Vault Encryption Key
   │
   ▼
Create Encrypted Vault
   │
   ▼
Vault
```

## Returning User

```text
Login
  │
  ▼
Email OTP
  │
  ▼
JWT Session
  │
  ▼
Unlock Vault
  │
  ▼
Enter Master Password
  │
  ▼
Argon2id Key Derivation
  │
  ▼
AES-256-GCM Decryption
  │
  ▼
Vault
```

---

# 🧰 Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type-safe development |
| Vite | Development & build tooling |
| React Router | Application routing |
| Web Crypto API | AES-GCM encryption/decryption |
| hash-wasm | Argon2id key derivation |

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend language |
| FastAPI | REST API |
| SQLAlchemy | ORM |
| Alembic | Database migrations |
| Pydantic | Validation & schemas |
| PyJWT | JWT authentication |
| pwdlib + Argon2 | Secure hashing |
| SQLite | Development database |
| Uvicorn | ASGI server |
| pytest | Automated testing |

---

# 📁 Project Structure

```text
VaultX/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── generator/
│   │   │   ├── security/
│   │   │   ├── settings/
│   │   │   └── vault/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── crypto.ts
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   ├── core/
│   │   ├── db/
│   │   ├── schemas/
│   │   └── services/
│   ├── migrations/
│   ├── tests/
│   ├── requirements.txt
│   └── alembic.ini
│
├── .gitignore
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have:

- Git
- Node.js 22+
- pnpm
- Python 3.13+
- pip / virtual environment

---

# 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/VaultX.git
cd VaultX
```

---

# 2️⃣ Start the Backend

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it:

### Linux / macOS

```bash
source .venv/bin/activate
```

### Windows

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your environment file:

```bash
cp .env.example .env
```

Generate your own JWT secret and put it in `.env`.

Run database migrations:

```bash
alembic upgrade head
```

Start the API:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend will be available at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

---

# 3️⃣ Start the Frontend

Open another terminal:

```bash
cd VaultX/frontend
```

Install dependencies:

```bash
pnpm install
```

Create the environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
pnpm dev
```

Open the URL shown by Vite, for example:

```text
http://localhost:8443
```

---

# 🧪 Running Tests

From the backend directory:

```bash
cd backend
source .venv/bin/activate
python -m pytest -q
```

The test suite covers important backend functionality including:

- Health endpoint
- Authentication
- OTP flow
- Protected routes
- Vault access
- Password generation
- Session behavior

---

# 🔌 API Overview

Base URL:

```text
/api/v1
```

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/signup` | Request signup OTP |
| POST | `/auth/signup/verify` | Verify signup OTP |
| POST | `/auth/login` | Request login OTP |
| POST | `/auth/login/verify` | Verify login OTP |
| POST | `/auth/logout` | Revoke current session |
| GET | `/auth/me` | Get authenticated user |

## Vault

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/vault` | Create encrypted vault |
| GET | `/vault` | Retrieve encrypted vault |
| PUT | `/vault` | Update encrypted vault |

## Password Generator

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/password/generate` | Generate secure password |

## System

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API health check |

Interactive API documentation is available through FastAPI Swagger UI:

```text
/docs
```

---

# 🔐 Security Design

Security was treated as a core architectural requirement rather than a UI feature.

### 1. Master password stays client-side

The master password is used by the frontend to derive the vault encryption key.

It is never intentionally sent to the backend.

### 2. Argon2id key derivation

Vault encryption keys are derived using Argon2id with a unique salt.

### 3. AES-256-GCM

Vault data is encrypted using authenticated AES-256-GCM encryption.

This provides both:

- Confidentiality
- Integrity/authentication

### 4. Secure OTP generation

OTP codes are generated using Python's `secrets` module.

OTP values are stored as secure hashes rather than plaintext.

### 5. JWT session management

Authentication uses signed JWT access tokens combined with server-side session records.

Sessions can be revoked during logout.

### 6. Input validation

FastAPI/Pydantic schemas validate API inputs and enforce limits on sensitive payloads.

### 7. OTP abuse protection

OTP requests include:

- Expiration
- Attempt limits
- Resend cooldown
- Single-use verification
- Previous OTP invalidation

---

# 🧠 Design Philosophy

VaultX follows three important principles:

### 🔒 Privacy First

Sensitive vault information should remain encrypted and inaccessible to the backend in plaintext.

### 🧩 Simple Architecture

Instead of creating a database row for every password, the application stores the vault as an encrypted payload.

### ⚡ Hackathon-Friendly Engineering

The architecture is designed to demonstrate meaningful security concepts while remaining small enough to build, test, and understand within a hackathon environment.

---

# 🚧 Current Scope

VaultX is currently an MVP / hackathon implementation.

### Included

- Authentication
- OTP verification
- JWT sessions
- Encrypted vault
- Password generation
- Credential management
- Vault locking
- Logout/revocation
- Security health
- Master password reset
- Automated backend tests

### Potential Future Improvements

- PostgreSQL production database
- HTTPS / production deployment
- Secure email OTP provider
- Browser extension
- Mobile application
- Passkeys / WebAuthn
- Biometric unlock
- Secure sharing
- Breach monitoring
- Password autofill
- Multi-device synchronization
- Hardware security key support
- Security audit / penetration testing

---

# ⚠️ Security Disclaimer

VaultX is a **hackathon project and MVP**, not a professionally audited password manager.

The project demonstrates secure design principles such as client-side encryption, Argon2id key derivation, AES-256-GCM, secure OTP generation, and session revocation.

It has **not undergone a professional security audit or penetration test** and should not be used to store highly sensitive production credentials without further security review.

---

# 👥 Team

## The Unlockers

Built with ❤️ for the college hackathon.

**Project:** VaultX  
**Category:** Cybersecurity / Password Management  
**Type:** Secure Password Manager

---

# 📜 License

This project is currently intended for educational and hackathon purposes.

A formal open-source license can be added as the project evolves.
