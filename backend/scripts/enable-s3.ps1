# Sets STORAGE_DRIVER=S3 and seeds S3 env keys in .env
param(
  [string]$EnvFile = (Join-Path (Get-Location) ".env"),
  [string]$Bucket = "domana-dev",
  [string]$Region = "us-east-1"
)
if (-not (Test-Path $EnvFile)) { throw ".env not found at $EnvFile" }

$bak = "$EnvFile.bak.$(Get-Date -Format yyyyMMddHHmmss)"
Copy-Item $EnvFile $bak -Force
Write-Host "Backed up to $bak"

function Upsert([string]$Key,[string]$Val){
  $escaped = [regex]::Escape($Key)
  $content = Get-Content $EnvFile -Raw
  if ($content -match "^$escaped="){
    $content = [regex]::Replace($content, "^$escaped=.*$", "$Key=$Val", 'Multiline')
  } else {
    if (-not $content.EndsWith("`n")) { $content += "`r`n" }
    $content += "$Key=$Val`r`n"
  }
  $content | Set-Content $EnvFile -Encoding UTF8
}
Upsert "STORAGE_DRIVER" "S3"
Upsert "S3_BUCKET" $Bucket
Upsert "S3_REGION" $Region
if (-not (Select-String -Path $EnvFile -Pattern "^AWS_ACCESS_KEY_ID=" -SimpleMatch -ErrorAction SilentlyContinue)) {
  Upsert "AWS_ACCESS_KEY_ID" "REPLACE_ME"
}
if (-not (Select-String -Path $EnvFile -Pattern "^AWS_SECRET_ACCESS_KEY=" -SimpleMatch -ErrorAction SilentlyContinue)) {
  Upsert "AWS_SECRET_ACCESS_KEY" "REPLACE_ME"
}
Write-Host "S3 enabled in .env (replace AWS creds)."