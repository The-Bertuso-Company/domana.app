# one-shot.v2.ps1
$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'

# --- Config ------------------------------------------------------------
$RepoRoot     = $PWD
$FrontendDir  = Join-Path $RepoRoot 'frontend'
if (-not (Test-Path $FrontendDir)) { throw "Missing ./frontend directory (expected $FrontendDir)" }

$PreviewUrlFallback = $Env:PREVIEW_URL_FALLBACK
if (-not $PreviewUrlFallback) { $PreviewUrlFallback = 'https://domana-ag0oy2z54-dinj-valric-bertusos-projects.vercel.app' }
$BypassToken = $Env:VERCEL_BYPASS_TOKEN
$VercelToken = $Env:VERCEL_TOKEN

# --- Helpers -----------------------------------------------------------
function Note([string]$m){ Write-Host ("  " + $m) -ForegroundColor Cyan }
$GitExe = (Get-Command git -CommandType Application).Source
function HttpGet([string]$u){
  if (-not $VercelToken) { return $null }
  Invoke-RestMethod -Method GET -Uri $u -Headers @{ Authorization = "Bearer $VercelToken" }
}

# --- 0) Ignore & untrack large artifacts -------------------------------
$gitignore = Join-Path $RepoRoot '.gitignore'
if (-not (Test-Path $gitignore)) { New-Item -ItemType File -Path $gitignore | Out-Null }

$ignoreLines = @(
  '# Auto: ignore large artifacts',
  '_artifacts/','_artifacts/**',
  'mobile/**/build/','mobile/android/**/build/','mobile/ios/**/build/',
  '*.apk','*.aab','*.ipa','*.dSYM.zip','*.tar.gz'
)
$existing = @(); try { $existing = Get-Content $gitignore -ErrorAction SilentlyContinue } catch {}
$toAdd = @(); foreach($l in $ignoreLines){ if ($existing -notcontains $l) { $toAdd += $l } }
if ($toAdd.Count -gt 0) {
  if ($existing.Count -gt 0 -and $existing[-1] -ne '') { Add-Content $gitignore "" }
  Add-Content $gitignore ($toAdd -join "`n")
  Add-Content $gitignore ""
}

& $GitExe rm -r --cached --ignore-unmatch -- '_artifacts' 2>$null | Out-Null

$tracked = (& $GitExe ls-files 2>$null) -split "`n"
$big = @()
foreach($p in $tracked){
  if ([string]::IsNullOrWhiteSpace($p)) { continue }
  $fi = Get-Item -LiteralPath $p -ErrorAction SilentlyContinue
  if ($fi -and $fi.Length -ge 95MB) { $big += $p }
}
foreach($p in $big){ & $GitExe rm --cached -- "$p" 2>$null | Out-Null }
if ($big.Count -gt 0) { Note "Untracked big files from index: $($big.Count)" }

# --- 1) Normalize robots + middleware ----------------------------------
$srcApp  = Join-Path $FrontendDir 'src\app'
$rootApp = Join-Path $FrontendDir 'app'
$appDir  = if (Test-Path $srcApp) { $srcApp } else { $rootApp }
Note "Using app dir: $appDir"

# /robots.txt route
$robotsRouteDir = Join-Path $appDir 'robots.txt'
New-Item -ItemType Directory -Force -Path $robotsRouteDir | Out-Null
@'
export async function GET() {
  const isProd = (process.env.VERCEL_ENV ?? '') === 'production';
  const body = isProd
    ? `User-agent: *\nAllow: /\nSitemap: https://domana.app/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
'@ | Set-Content -Encoding utf8 (Join-Path $robotsRouteDir 'route.ts')

# remove other robots sources
$inactive = if ($appDir -eq $srcApp) { $rootApp } else { $srcApp }
@(
  Join-Path $FrontendDir 'app\robots.ts';
  Join-Path $FrontendDir 'src\app\robots.ts';
  (Join-Path $inactive 'robots.txt')
) | Where-Object { Test-Path $_ } | ForEach-Object { Remove-Item -Recurse -Force $_ }

# kill any public/robots.txt
Get-ChildItem -Recurse -File -Path $FrontendDir -Filter robots.txt |
  Where-Object { $_.FullName -match '\\public\\robots\.txt$' } |
  ForEach-Object { Remove-Item $_.FullName -Force }

# middleware (X-Robots-Tag off-prod)
$mwPath = Join-Path $FrontendDir 'middleware.ts'
@'
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const isHTML = (req.headers.get('accept') || '').includes('text/html');
  const isProd = (process.env.VERCEL_ENV ?? '') === 'production';
  if (isHTML && !isProd) res.headers.set('x-robots-tag','noindex, nofollow, noarchive');
  return res;
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'] };
'@ | Set-Content -Encoding utf8 $mwPath

# next-sitemap
$smPath = Join-Path $FrontendDir 'next-sitemap.config.js'
@'
const isProd = process.env.VERCEL_ENV === 'production';
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: isProd ? 'https://domana.app' : 'https://example.invalid',
  generateRobotsTxt: true,
  robotsTxtOptions: isProd
    ? { policies: [{ userAgent: '*', allow: '/' }, { userAgent: '*', disallow: '/beta' }] }
    : { policies: [{ userAgent: '*', disallow: '/' }] },
};
'@ | Set-Content -Encoding utf8 $smPath

# minimal sitemap placeholder
$sitemapPath = Join-Path $appDir 'sitemap.ts'
if (-not (Test-Path $sitemapPath)) {
@'
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://staging.domana.app", lastModified: new Date() }];
}
'@ | Set-Content -Encoding utf8 $sitemapPath
}

# --- 2) Commit & push safely ------------------------------------------
$insideRepo = (& $GitExe rev-parse --is-inside-work-tree 2>$null) -eq 'true'
if ($insideRepo) {
  $branch = (& $GitExe rev-parse --abbrev-ref HEAD 2>$null).Trim()
  & $GitExe fetch --quiet origin $branch 2>$null | Out-Null
  & $GitExe add -A 2>$null | Out-Null
  $needCommit = (((& $GitExe status --porcelain 2>$null) -join "`n").Trim().Length -gt 0)
  if ($needCommit) {
    & $GitExe commit -m "chore(web): robots/middleware hardening; ignore large artifacts; idempotent" 2>$null | Out-Null
    & $GitExe push 2>$null | Out-Null
    Note "Pushed."
  } else { Note "No changes to commit." }
} else {
  Note "Not a git repo - skipping commit/push."
}

# --- 3) Determine preview URL (API if token present) ------------------
$previewUrl = $null
if ($VercelToken) {
  $vercelMetaFile = Join-Path $FrontendDir ".vercel\project.json"
  if (Test-Path $vercelMetaFile) {
    $projMeta  = Get-Content $vercelMetaFile -Raw | ConvertFrom-Json
    $projectId = $projMeta.projectId
    if ($projectId) {
      function Matches-SHA([object]$meta,[string]$sha){
        if ($null -eq $meta -or [string]::IsNullOrWhiteSpace($sha)) { return $false }
        $props = @('githubCommitSha','gitlabCommitSha','bitbucketCommitSha','commitSha','commitSHA','sha')
        foreach($k in $props){ if ($meta.PSObject.Properties.Name -contains $k) {
          $val = $meta.$k; if ($null -ne $val -and ("$val" -eq $sha)) { return $true }
        }}
        foreach($p in $meta.PSObject.Properties){ $v = $p.Value; if ($null -ne $v -and ("$v" -eq $sha)) { return $true } }
        return $false
      }
      $branch = (& $GitExe rev-parse --abbrev-ref HEAD 2>$null).Trim()
      $sha    = (& $GitExe rev-parse HEAD 2>$null).Trim()
      $deadline = (Get-Date).AddMinutes(5)
      do {
        Start-Sleep -Seconds 4
        $u = "https://api.vercel.com/v6/deployments?projectId=$projectId&target=preview&limit=50"
        $resp = HttpGet $u
        if (-not $resp) { break }
        $candidates = @()
        foreach($d in $resp.deployments){
          $meta = $d.meta; $branchMatch = $false
          foreach($nm in @('githubCommitRef','gitlabCommitRef','bitbucketCommitRef','commitRef','branch')){
            if ($meta.PSObject.Properties.Name -contains $nm) {
              if (("$($meta.$nm)" -eq $branch)) { $branchMatch = $true; break }
            }
          }
          if ($branchMatch) { $candidates += $d }
        }
        if (-not $candidates) { continue }
        $exact = $candidates | Where-Object { Matches-SHA $_.meta $sha }
        $pick  = if ($exact) { $exact | Sort-Object created -Descending | Select-Object -First 1 }
                 else { $candidates | Sort-Object created -Descending | Select-Object -First 1 }
        if ($pick.state -eq 'READY') { $previewUrl = "https://$($pick.url)"; break }
        Note "Waiting for READY. (state=$($pick.state))"
      } while ((Get-Date) -lt $deadline)
    }
  }
}
if (-not $previewUrl) { $previewUrl = $PreviewUrlFallback; Note "Using fallback preview URL: $previewUrl" } else { Note "Preview (API): $previewUrl" }

# --- 4) Verify robots + X-Robots-Tag (bypass optional) ----------------
try {
  $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  if ($BypassToken) {
    $bypassUrl = "$previewUrl/?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=$BypassToken"
    Invoke-WebRequest $bypassUrl -WebSession $session -MaximumRedirection 20 -UseBasicParsing | Out-Null
  }
  $cb = (Get-Date).Ticks
  $headersNoCache = @{ 'Cache-Control'='no-cache'; 'Pragma'='no-cache' }
  $headersHtml    = @{ 'Accept'='text/html'; 'Cache-Control'='no-cache'; 'Pragma'='no-cache' }

  $robots = (Invoke-WebRequest "$previewUrl/robots.txt?cb=$cb" -Headers $headersNoCache -WebSession $session -MaximumRedirection 20 -UseBasicParsing).Content
  $xrt    = (Invoke-WebRequest "$previewUrl/?cb=$cb"           -Headers $headersHtml    -WebSession $session -MaximumRedirection 20 -UseBasicParsing).Headers['X-Robots-Tag']

  Write-Host "`nrobots.txt:`n$robots"
  Write-Host "`nX-Robots-Tag: $xrt"
  if ($robots -match '(?im)^\s*Disallow:\s*/\s*$' -and ($xrt -match 'noindex')) {
    Write-Host "`nOK: Preview is not indexable (robots + header)." -ForegroundColor Green
  } else {
    Write-Warning "`nPreview shows old robots; check Vercel Root Directory=frontend or redeploy latest commit."
  }
} catch {
  Note "Preview likely protected; set `$Env:VERCEL_BYPASS_TOKEN` to verify automatically."
}
$global:LASTEXITCODE = 0
