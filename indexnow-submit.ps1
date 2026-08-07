param(
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$hostName = 'www.pregnancyweektracker.com'
$key = '4b8e2d1f0a9c43e7b6d215f9c4a8e731'
$keyLocation = "https://$hostName/$key.txt"
$sitemapPath = Join-Path $PSScriptRoot 'sitemap.xml'

if (-not (Test-Path $sitemapPath)) {
  throw "sitemap.xml not found at $sitemapPath"
}

[xml]$xml = Get-Content $sitemapPath
$locNodes = $xml.SelectNodes('//*[local-name()="url"]/*[local-name()="loc"]')
$urlList = @()
foreach ($node in $locNodes) {
  $u = ($node.InnerText).Trim()
  if (-not [string]::IsNullOrWhiteSpace($u)) { $urlList += $u }
}

if ($urlList.Count -eq 0) {
  throw 'No URLs found in sitemap.xml'
}

$payload = @{
  host = $hostName
  key = $key
  keyLocation = $keyLocation
  urlList = $urlList
} | ConvertTo-Json -Depth 4

if ($DryRun) {
  Write-Host "Dry run: would submit $($urlList.Count) URLs to IndexNow for $hostName"
  exit 0
}

Invoke-RestMethod -Method Post -Uri 'https://api.indexnow.org/indexnow' -ContentType 'application/json; charset=utf-8' -Body $payload | Out-Null
Write-Host "Submitted $($urlList.Count) URLs to IndexNow for $hostName"
