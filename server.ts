import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parsing for POST bodies
  app.use(express.json());

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

  // API Route: MCP GET
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Farcast Drift MCP Endpoint",
      status: "active",
      description: "Active MCP server for Farcast Drift Orchestrator Agent",
      capabilities: ["farcaster-integration", "drift-mechanics", "social-automation"],
      timestamp: new Date().toISOString()
    });
  });

  // API Route: MCP POST
  app.post("/api/mcp", (req, res) => {
    try {
      const body = req.body;
      const { action, command, params } = body;

      let result: any = {};

      switch (action || command) {
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Farcast Drift Orchestrator",
            message: "Ready for farcaster operations" 
          };
          break;

        case "execute":
          result = {
            success: true,
            action: command || params,
            executedAt: new Date().toISOString(),
            message: "Command executed successfully"
          };
          break;

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
            message: "Command received",
            data: body
          };
      }

      res.json({
        status: "success",
        agent: "Farcast Drift Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

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
    // Production serving static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Provide fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
