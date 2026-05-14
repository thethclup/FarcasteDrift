# Farcaster Drift

**Farcaster Drift** is a high-speed cyberpunk endless racing / drifting game set in the Farcaster universe. You are a **Cast Racer** who races through neon-lit digital cities, floating warp tracks, and viral feed highways. Master drifting, timing, and power-ups to achieve the highest score and become the ultimate Farcaster legend.

## Features (Mobile First)

- **Mechanics:** Smooth touch-based drifting controls (swipe to steer, hold for drift). Fast-paced endless runner/racer style with increasing speed.
- **Hype Meter:** Drift around corners to build your Hype Meter and score multipliers.
- **On-chain Integration:** Uses Base Mainnet for score submissions. Real transactional capabilities with SIWE.
- **ERC-8004 AI Agent Integration:** Includes an autonomous `Farcast Drift Orchestrator` AI agent to handle multi-cast logic and in-game interactions.
- **ERC-8021 Transaction Attribution:** Supports transaction attribution for builders.

## ⚠️ Important Note regarding Sensitive Data

This repository contains integration logic meant for demonstration and preview purposes within Google AI Studio. 

**Do NOT commit real or active private keys, seed phrases, or active API keys to this repository.** Make sure to use environment variables (`.env`) for any sensitive secrets, and only add templates to `.env.example`.

## File Structure & Agent Components
The game has built-in smart orchestration handled securely over a backend proxy (`server.ts`):
- `public/.well-known/agent-card.json`: Registers the AI Agent under ERC-8004 standards.
- `server.ts`: Includes an **MCP (Model Context Protocol)** active command execution API (`/api/mcp`) and an orchestrator profile API (`/api/agent`).

## Tech Stack
- Frontend: React 19, Tailwind CSS v4, HTML5 Canvas, Framer Motion
- Backend: Express, Vite Middleware
- APIs: Wagmi, Viem (Simulated on UI, prepped for integration)
- Blockchain: **Base Mainnet**
