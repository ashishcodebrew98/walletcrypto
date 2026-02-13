# walletcrypto

React-based, mobile-first wallet prototype for the Nigerian market (CDN React) with comprehensive mock onboarding, security, KYC, and dashboard flows.

## Included flows

- Welcome + multi-auth entry (phone/email/google/microsoft buttons)
- Phone signup + OTP verification
- Email signup + password strength and requirements checklist
- PIN setup (create + confirm) with keypad simulation
- Biometric enablement step
- KYC introduction + Level 1 form + Level 2 verification uploads/selfie
- KYC status states (pending/approved/rejected simulation)
- Home dashboard with wallets, quick actions, and recent transactions

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.
