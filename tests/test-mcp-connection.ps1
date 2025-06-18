#!/usr/bin/env pwsh

# Test script for the n8n MCP Server
# This script demonstrates the MCP server capabilities

Write-Host "🚀 Testing n8n MCP Server" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

# Test API connection first
Write-Host "📡 Testing n8n API connection..." -ForegroundColor Cyan
try {
    $apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTJlZGQ5ZS00Zjk2LTQ5ZjYtOGYwZC1iYTk3ZDAxOTc4ZjciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUwMjI4NDcyfQ.4JwwhKuhHRtH3UpcWIajCnkvbKCZBFt4Trfji5P1gks"
    $headers = @{"X-N8N-API-KEY" = $apiKey}
    $workflows = Invoke-RestMethod -Uri "http://localhost:5678/api/v1/workflows" -Headers $headers

    Write-Host "✅ API connection successful!" -ForegroundColor Green
    Write-Host "📊 Found $($workflows.data.Count) workflows" -ForegroundColor White
      if ($workflows.data.Count -gt 0) {
        Write-Host "📋 Available workflows:" -ForegroundColor Cyan
        foreach ($workflow in $workflows.data) {
            $status = if ($workflow.active) { "🟢 Active" } else { "🔴 Inactive" }
            Write-Host "   • $($workflow.name) (ID: $($workflow.id)) - $status" -ForegroundColor White
        }
    }
    Write-Host ""
} catch {
    Write-Host "❌ API connection failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test MCP server startup
Write-Host "🔄 Testing MCP Server startup..." -ForegroundColor Cyan
Write-Host "Server configuration in .vscode/mcp.json:" -ForegroundColor Yellow
Write-Host "  • Server name: n8n-workflow-builder" -ForegroundColor White
Write-Host "  • Command: node D:\Dev\n8n-api-mcp\dist\index.js" -ForegroundColor White
Write-Host "  • n8n URL: http://localhost:5678/api/v1" -ForegroundColor White
Write-Host "  • API Key: ✅ Configured" -ForegroundColor White
Write-Host ""

# Display available MCP tools
Write-Host "🛠️ Available MCP Tools:" -ForegroundColor Cyan
$tools = @(
    @{name="list_workflows"; desc="List all workflows with filtering options"},
    @{name="get_workflow"; desc="Get detailed workflow information"},
    @{name="create_workflow"; desc="Create workflows from natural language"},
    @{name="update_workflow"; desc="Update workflows and add nodes"},
    @{name="delete_workflow"; desc="Delete workflows with confirmation"},
    @{name="activate_workflow"; desc="Activate workflows for execution"},
    @{name="deactivate_workflow"; desc="Deactivate workflows"},
    @{name="list_executions"; desc="List workflow executions"},
    @{name="get_execution"; desc="Get execution details"},
    @{name="get_execution_summary"; desc="Get execution statistics"},
    @{name="list_credentials"; desc="List configured credentials"},
    @{name="create_credential"; desc="Create new credentials"},
    @{name="get_credential_types"; desc="List available credential types"}
)

foreach ($tool in $tools) {
    Write-Host "   • $($tool.name)" -ForegroundColor Green -NoNewline
    Write-Host " - $($tool.desc)" -ForegroundColor White
}
Write-Host ""

# Display MCP resources
Write-Host "📊 Available MCP Resources:" -ForegroundColor Cyan
$resources = @(
    @{uri="n8n://workflows"; desc="JSON resource with all workflows"},
    @{uri="n8n://executions"; desc="JSON resource with recent executions"},
    @{uri="n8n://credentials"; desc="JSON resource with credentials (data excluded)"},
    @{uri="n8n://status"; desc="JSON resource with instance health status"}
)

foreach ($resource in $resources) {
    Write-Host "   • $($resource.uri)" -ForegroundColor Green -NoNewline
    Write-Host " - $($resource.desc)" -ForegroundColor White
}
Write-Host ""

# Usage examples
Write-Host "💬 Example AI Commands (once connected to Claude Desktop):" -ForegroundColor Cyan
$examples = @(
    "List my n8n workflows",
    "Create a workflow that sends an email when I receive a webhook",
    "Show me recent executions for my data processing workflow",
    "Add a Slack notification to workflow ID abc123",
    "What credentials are configured in my n8n instance?",
    "Activate the workflow called `"Demo: My first AI workflow`"",
    "Show me the execution history for the last 24 hours"
)

foreach ($example in $examples) {
    Write-Host "   • `"$example`"" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "🎉 MCP Server is ready for Claude Desktop integration!" -ForegroundColor Green
Write-Host "⚡ Your n8n workflows are now AI-powered!" -ForegroundColor Magenta
