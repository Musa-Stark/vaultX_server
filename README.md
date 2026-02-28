# Vault Key Server

Secure backend API for a password manager application. This server handles authentication, vault item CRUD, JWT authorization, and password encryption/decryption using `libsodium`.

## GitHub Description (Short)

`Secure Node.js/Express backend for a password manager with JWT auth, MongoDB storage, and libsodium-based encryption for vault secrets.`

## Overview

Vault Key Server is an Express + MongoDB API that powers a password manager frontend.

Core responsibilities:
- Register and authenticate users
- Validate JWT tokens for protected routes
- Store vault entries (service credentials) per user
- Encrypt stored password values using libsodium
- Decrypt values only when returning authorized user data
- Apply API-level rate limiting, error handling, and security headers

## Tech Stack

- Node.js (ES Modules)
- Express 5
- MongoDB + Mongoose
- JSON Web Token (`jsonwebtoken`)
- `libsodium-wrappers-sumo`
- `helmet`
- `cors`
- `express-rate-limit`

## Project Structure

```text
.
├── app.js
├── server.js
├── config/
│   ├── db.js
│   ├── env.js
│   └── index.js
├── middleware/
│   ├── auth.middleware.js
│   └── errorHandler.js
├── modules/
│   ├── auth/
│   ├── password/
│   └── user/
└── utils/
    ├── sodium.js
    ├── limiter.js
    ├── successResponse.js
    ├── asyncHandler.js
    └── AppError.js
```

## Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/vault_key
JWT_ACCESS_SECRET=your_super_secret_jwt_key
JWT_ACCESS_TTL=7d
PORT=5000
ENV=development
MASTER_KEY=base64_encoded_32_byte_key
```

Notes:
- `MASTER_KEY` must be a valid base64 key compatible with libsodium secretbox.
- Keep `.env` private and never commit it.

## Installation & Run

```bash
npm install
npm run dev
```

Server starts on:
- `http://localhost:<PORT>`

Health endpoint:
- `GET /api/v1/health`

## API Base URL

- Local: `http://localhost:5000/api/v1` (or your configured port)

## Authentication

Protected routes require:

```http
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Auth

#### `POST /api/v1/auth/register`
Create a new user.

Request body:
```json
{
  "name": "Tony Stark",
  "email": "tony@example.com",
  "password": "secret123",
  "masterPassword": "master123"
}
```

Response (`201`):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Tony Stark",
      "email": "tony@example.com",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "token": "<jwt>"
  }
}
```

#### `POST /api/v1/auth/login`
Authenticate user and return JWT.

Request body:
```json
{
  "email": "tony@example.com",
  "password": "secret123"
}
```

Response (`200`):
```json
{
  "success": true,
  "data": {
    "token": "<jwt>"
  }
}
```

#### `GET /api/v1/auth/token` (Protected)
Validate token and return user payload from DB.

Response (`200`):
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Tony Stark",
    "email": "tony@example.com"
  }
}
```

#### `POST /api/v1/auth/unlock` (Protected)
Validate `masterPassword` for current user (used by frontend before showing sensitive vault data/workflows).

Request body:
```json
{
  "masterPassword": "master123"
}
```

### Password Vault

#### `GET /api/v1/password` (Protected)
Get all vault items for logged-in user.

- Stored encrypted password values are decrypted before response.
- Internal crypto fields are removed from response.

#### `POST /api/v1/password` (Protected)
Create a new vault item.

Request body:
```json
{
  "service": "GitHub",
  "username": "tonystark",
  "password": "gh_secret_123",
  "category": "Development",
  "icon": "🔐"
}
```

Response (`201`) returns created item with decrypted password and without internal crypto fields.

#### `PATCH /api/v1/password` (Protected)
Update existing vault item.

Request body currently expects full object including ownership check fields:
```json
{
  "_id": "vault_item_id",
  "owner": "authenticated_user_id",
  "service": "GitHub",
  "username": "tonystark",
  "password": "new_secret_123",
  "category": "Development",
  "icon": "🔐"
}
```

#### `DELETE /api/v1/password` (Protected)
Delete vault item.

Request body:
```json
{
  "_id": "vault_item_id",
  "owner": "authenticated_user_id"
}
```

## Validation Rules

- Register: `name`, `email`, `password`, `masterPassword` are required
- Login: `email`, `password` are required
- Password item: `service`, `username`, `password`, `category`, `icon` are required
- Passwords must be at least 6 characters

## Encryption Model

Vault item passwords are encrypted using libsodium:
- A keypair is generated per secret
- Password string is sealed with `crypto_box_seal`
- Private key is encrypted with `crypto_secretbox_easy` using `MASTER_KEY`
- DB stores: encrypted password + nonce + public key + secured private key
- API decrypts password on authorized retrieval

## Security Controls

- `helmet` adds secure HTTP headers
- `cors` enabled for cross-origin frontend calls
- API rate limiter applied to `/api/v1/*`
- JWT verification middleware for protected routes
- Centralized error handling with structured JSON response

## Frontend Integration

This server is designed to work as the backend for your password manager frontend.

Typical frontend flow:
1. User registers or logs in
2. Frontend stores JWT (prefer secure storage strategy)
3. Frontend sends `Authorization: Bearer <token>` for protected routes
4. Frontend can call `/auth/unlock` with `masterPassword` before allowing sensitive actions
5. Frontend loads vault entries via `GET /password` and renders decrypted values from response
6. Frontend creates/updates/deletes entries via `/password` routes

Frontend responsibilities:
- Manage auth state and token lifecycle
- Handle 401 responses by redirecting to login
- Respect 429 rate-limit responses and `Retry-After` header
- Never hardcode backend secrets (`MASTER_KEY`, JWT secret) in client code

## Error Response Format

When requests fail:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Scripts

- `npm run dev` - start server with nodemon

## License

ISC
