#!/usr/bin/env pwsh

# n8n MCP Server Test Script
# This script demonstrates how to test the MCP server with environment variables

Write-Host "n8n MCP Server Test" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "Found .env file" -ForegroundColor Green
} else {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Created .env file from .env.example" -ForegroundColor Green
        Write-Host "Please edit .env file and set your N8N_API_URL and N8N_API_KEY" -ForegroundColor Yellow
    } else {
        Write-Host "Creating basic .env file..." -ForegroundColor Yellow
        @"
N8N_API_URL=http://localhost:5678/api/v1
N8N_API_KEY=your_n8n_api_key_here
LOG_LEVEL=info
TIMEOUT=30000
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "Created .env file. Please edit it and set your N8N_API_URL and N8N_API_KEY" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Available commands:" -ForegroundColor Cyan
Write-Host "  npm run build   - Build the TypeScript project" -ForegroundColor White
Write-Host "  npm run dev     - Run in development mode with watch" -ForegroundColor White
Write-Host "  npm start       - Start the production server" -ForegroundColor White
Write-Host "  npm test        - Run tests" -ForegroundColor White
Write-Host ""

Write-Host "To test with Claude Desktop:" -ForegroundColor Cyan
Write-Host "1. Set your n8n API URL and API key in .env" -ForegroundColor White
Write-Host "2. Add this server to your claude_desktop_config.json" -ForegroundColor White
Write-Host "3. Restart Claude Desktop" -ForegroundColor White
Write-Host ""

Write-Host "Configuration path for Claude Desktop:" -ForegroundColor Cyan
$claudeConfigPath = "$env:APPDATA\Claude\claude_desktop_config.json"
Write-Host "  $claudeConfigPath" -ForegroundColor White
Write-Host ""

Write-Host "Example Claude Desktop configuration:" -ForegroundColor Cyan
$currentDir = Get-Location
$serverPath = Join-Path $currentDir "dist\index.js"
@"
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["$serverPath"],
      "env": {
        "N8N_API_URL": "http://localhost:5678/api/v1",
        "N8N_API_KEY": "your_n8n_api_key_here"
      }
    }
  }
}
"@ | Write-Host -ForegroundColor Yellow

Write-Host ""
Write-Host "Server built successfully! Check the docs/ folder for more information." -ForegroundColor Green
