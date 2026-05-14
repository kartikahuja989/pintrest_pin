$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$zip = Join-Path $root "pinfashion-ai.zip"
if (Test-Path $zip) { Remove-Item $zip -Force }
$items = Get-ChildItem -LiteralPath $root -Force | Where-Object { $_.Name -notin @("node_modules", ".next", "pinfashion-ai.zip") }
Compress-Archive -Path $items.FullName -DestinationPath $zip -Force
Write-Host "Exported $zip"
