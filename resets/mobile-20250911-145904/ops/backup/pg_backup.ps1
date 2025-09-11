# ops/backup/pg_backup.ps1 — Dumps DB to ./ops/backup/backups with timestamped filename.
param(
  [string]$OutDir = "$(Split-Path -Parent $MyInvocation.MyCommand.Path)\backups",
  [string]$Format = "custom"  # plain | custom | directory | tar
)
$ErrorActionPreference = "Stop"
if (-not $env:DATABASE_URL) { Write-Error "DATABASE_URL not set"; exit 1 }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$ts = Get-Date -Format "yyyyMMdd_HHmmss"
$out = Join-Path $OutDir "domana_$ts.dump"
& pg_dump $env:DATABASE_URL --format=$Format --file=$out
Write-Host "Backup written: $out"
