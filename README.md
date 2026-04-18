# ChainVote - Secure Digital Voting DApp

A decentralized, highly secure voting platform built using React and Rust (ICP Smart Contracts).

## Problem Solved
Traditional voting systems suffer from tampering, duplication, lack of transparency, and centralized manipulation.
**ChainVote** provides a completely decentralized, tamper-proof and immutable voting layer using blockchain technologies.

## Tech Stack
- **Frontend**: React (Vite), Bootstrap, Framer Motion, Recharts
- **Backend / Smart Contract**: Rust (Internet Computer Protocol - ICP)
- **Deployment**: Local / ICP Network

## Key Features
- **One Vote per Identity**: Cryptographic checks prevent duplicate voting
- **Immutability**: Vote records cannot be modified or deleted
- **Transparency**: Live results tracking via charts
- **Aadhaar Simulation**: Simulated identity verification for robust integrity
- **Admin Dashboard**: Start/Stop elections and dynamic candidate addition
- **AI Fraud Scanner**: Administrative heuristic scanning controls

## Setup Instructions

### 1. Run the Frontend 
To test the React UI:
```bash
cd voting-dapp
npm install
npm run dev
```

### 2. Mock Smart Contract Deploy (ICP Canister)
The Rust smart contract code is located in `backend/lib.rs`. Ensure you have `dfx` (DFINITY SDK) installed:
```bash
dfx start --background
dfx deploy
```

> **Viva Notes for Developer:** 
> - Emphasize the separation of concerns: React handles UX and local mock state for now, but in production, all `has_voted` and `voteCount` mutations occur directly on the Rust canister.
> - Data immutability is guaranteed by exactly-once execution limits on the ICP blockchain.



![Uploading Screenshot 2026-04-18 213205.png…]()
![Uploading Screenshot 2026-04-18 213226.png…]()
<img width="1918" height="892" alt="Screenshot 2026-04-18 213533" src="https://github.com/user-attachments/assets/3c6395cb-64d0-45e7-9315-60ccbc2e81df" />
![Uploading Screenshot 2026-04-18 213153.png…]()


