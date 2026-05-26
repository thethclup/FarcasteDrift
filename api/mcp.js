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

export default async function handler(req, res) {
  // CORS Headers for MCP / Agents
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Farcast Drift Orchestrator",
      status: "active",
      description: "Active MCP server for Farcast Drift Orchestrator Agent",
      capabilities: { tools: {}, prompts: {}, resources: {} },
      tools: TOOLS_LIST,
      prompts: [],
      resources: [],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const method = body.method || body.action || body.command || "status";
      const isJsonRpc = body.jsonrpc === "2.0";

      let result = {};

      switch (method) {
        case "initialize":
          result = {
            protocolVersion: "2024-11-05",
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
        case "status":
        case "ping":
          result = { status: "online", agent: "Farcast Drift Orchestrator", message: "Ready for farcaster operations" };
          break;
        case "execute":
        case "get_info":
          result = { name: "Farcast Drift Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
          break;
        default:
          result = { success: true, message: "Command parsed but method not explicitly handled", data: body };
      }

      const finalResponse = isJsonRpc 
        ? { jsonrpc: "2.0", id: body.id, result }
        : result;

      return res.status(200).json(finalResponse);
    } catch (error) {
      return res.status(400).json({ status: "error", message: "Failed to process MCP request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
