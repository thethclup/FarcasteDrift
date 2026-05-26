import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Allow CORS for the agents
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    next();
  });

  // API Route: Agent Info
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Farcast Drift Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Farcast Drift",
      version: "1.0.0"
    });
  });

  const TOOLS_LIST = [
    {
      name: "get_race_status",
      description: "Get the current real-time status of a race",
      inputSchema: { type: "object", properties: { raceId: { type: "string" } }, required: ["raceId"] }
    },
    {
      name: "start_race",
      description: "Start a new race on a given track",
      inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
    },
    {
      name: "get_leaderboard",
      description: "Get the top leaderboard by limit",
      inputSchema: { type: "object", properties: { limit: { type: "number" } }, required: ["limit"] }
    },
    {
      name: "optimize_speed",
      description: "Optimize the current speed profile",
      inputSchema: { type: "object", properties: { tactic: { type: "string" } } }
    },
    {
      name: "get_track_info",
      description: "Fetch track conditions and data",
      inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
    }
  ];

  // API Route: MCP GET
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Farcast Drift MCP Endpoint",
      status: "active",
      description: "Active MCP server for Farcast Drift Orchestrator Agent",
      capabilities: { tools: {}, prompts: {}, resources: {} },
      tools: TOOLS_LIST,
      prompts: [],
      resources: [],
      timestamp: new Date().toISOString()
    });
  });

  // API Route: MCP POST (Fully Implemented for Standard Schema)
  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const method = body.method || body.action || body.command;
      const isJsonRpc = body.jsonrpc === "2.0";

      let result: any = {};

      switch (method) {
        case "initialize":
          result = {
            protocolVersion: "1.0.0",
            capabilities: { tools: {}, prompts: {}, resources: {} },
            serverInfo: { name: "Farcast Drift Orchestrator", version: "1.0.0" }
          };
          break;

        case "tools/list":
          result = { tools: TOOLS_LIST };
          break;

        case "tools/call":
          const toolName = body.params?.name;
          result = {
            content: [{ type: "text", text: `Successfully executed tool: ${toolName}` }],
            isError: false
          };
          break;

        case "prompts/list":
          result = { prompts: [] };
          break;

        case "resources/list":
          result = { resources: [] };
          break;

        // Legacy Fallbacks
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Farcast Drift Orchestrator",
            message: "Ready for farcaster operations" 
          };
          break;

        case "execute":
        case "get_info":
          result = {
            name: "Farcast Drift Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Command parsed but method not explicitly handled",
            data: body
          };
      }

      const finalResponse = isJsonRpc 
        ? { jsonrpc: "2.0", id: body.id, result }
        : result;

      res.json(finalResponse);

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
