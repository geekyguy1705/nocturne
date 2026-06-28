# Windurf MCP Configuration

This file contains the MCP server configuration for Windurf.

```json
{
  "mcpServers": {
    "Astro docs": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.docs.astro.build/mcp"
      ]
    },
    "shadcn-ui-server": {
      "command": "npx",
      "args": ["@heilgar/shadcn-ui-mcp-server"]
    },
    "gsap-master": {
      "command": "npx",
      "args": [
        "-y",
        "@vinhnguyen/gsap-mcp"
      ]
    },
    "anime-js": {
      "command": "npx",
      "args": ["anime-js-mcp-server"]
    }
  }
}
```
