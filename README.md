# Farcast Drift Orchestrator

## Overview
**Farcast Drift** is a high-speed cyberpunk endless racing and drifting game set in the Farcaster universe. Players act as **Cast Racers** competing in neon-lit digital cities, warp tracks, and viral feed highways. The game features real-time orchestration, competitive mechanics, and a fully compliant EIP-8004 AI Agent.

## Architecture
- **Platform:** Base Mainnet
- **Orchestrator:** AI Agent powered by MCP (Model Context Protocol).
- **Frontend Engine:** Responsive, touch-optimized Canvas, React 19, Tailwind CSS v4.
- **Smart Validation:** Secure SIWE transaction submission endpoints.

## Agent Integration (EIP-8004)
The game integrates an autonomous **Farcast Drift Orchestrator**, coordinating operations via an active agent endpoint.
- `warp-racing`: Real-time mechanics optimization.
- `multi-track-orchestration`: Simultaneously tracking racing environments.
- `performance-optimization`: Live parameter tuning for racers.

### Agent Registry File
The agent metadata is hosted at `.well-known/agent-card.json`. This conforms strictly to the EIP-8004 registration configuration.

## Model Context Protocol (MCP) Setup
The AI Agent exposes an active MCP endpoint to execute tools and orchestrate interactions seamlessly:
- **Endpoint:** `/api/mcp`
- **Registered Tools:**
  - `get_race_status`: Get the current real-time status of a race.
  - `start_race`: Start a new race on a given track.
  - `get_leaderboard`: Fetch the top competitive racers.
  - `optimize_speed`: Engage deep performance tuning profiles.
  - `get_track_info`: Query condition data for specific grids.

## How to Run Locally

First, clone this repository and navigate into the source directory.

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy the sample environment file and fill it out if necessary (do not commit secrets).
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Verify MCP Endpoint (Serverless):**
   When deploying, the MCP endpoint will be available at `/api/mcp`.
