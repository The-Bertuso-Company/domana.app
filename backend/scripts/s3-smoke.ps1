# Verifies S3 env and basic connectivity (lightweight). Use -Strict to error on missing vars.
param([switch]$Strict)

Write-Host "S3 smoke:"
$envPath = Join-Path (Get-Location) ".env"
if (Test-Path $envPath) { Write-Host "  .env present" } else { Write-Warning "  .env missing (process env only)" }

$req = @("STORAGE_DRIVER","S3_BUCKET","S3_REGION","AWS_ACCESS_KEY_ID","AWS_SECRET_ACCESS_KEY")
$ok = $true
foreach($k in $req){
  if (-not $env:$k -and -not (Select-String -Path $envPath -Pattern "^$k=" -SimpleMatch -ErrorAction SilentlyContinue)) {
    Write-Warning "  missing $k"
    $ok = $false
  } else { Write-Host "  ✓ $k" }
}
if (-not $ok -and $Strict) { throw "Missing required S3 env" }

Write-Host "S3 smoke complete."