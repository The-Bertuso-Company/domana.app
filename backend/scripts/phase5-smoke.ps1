param(
  [string]$BaseUrl = "http://localhost:4000"
)
Write-Host "Phase-5 smoke @ $BaseUrl"

function Test-200 {
  param([string]$Path)
  $u = "$BaseUrl$Path"
  try {
    $r = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 8
    if ($r.StatusCode -ne 200) { throw "Non-200 for $u: $($r.StatusCode)" }
    Write-Host "  ✓ $Path"
  } catch {
    Write-Error "  ✗ $Path — $($_.Exception.Message)"
    exit 2
  }
}

Test-200 "/health"
Test-200 "/status"
Test-200 "/db/ping"

# Optional nearby (requires PostGIS + seed)
try {
  $near = Invoke-WebRequest -Uri "$BaseUrl/v1/listings/nearby?lat=14.5547&lng=121.0244&radius_km=5" -UseBasicParsing -TimeoutSec 8
  Write-Host "  ✓ /v1/listings/nearby (code $($near.StatusCode))"
} catch { Write-Warning "  ~ /v1/listings/nearby not ready (seed/DB?)" }

Write-Host "Smoke complete."