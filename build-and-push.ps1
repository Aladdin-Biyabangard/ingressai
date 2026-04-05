param(
    [Parameter(Mandatory = $true)]
    [string]$Tag,

    [Parameter(Mandatory = $false)]
    [string]$FrontendApiUrl = "http://65.21.51.215:9091/v1",

    [Parameter(Mandatory = $false)]
    [string]$PropertiesFile = "gradle.properties"
)

$ErrorActionPreference = "Stop"

function Get-PropertyValue {
    param(
        [string]$Content,
        [string]$Key
    )

    $pattern = "(?m)^\s*$([regex]::Escape($Key))\s*=\s*(.+)\s*$"
    $match = [regex]::Match($Content, $pattern)
    if ($match.Success) {
        return $match.Groups[1].Value.Trim()
    }
    return $null
}

if (!(Test-Path $PropertiesFile)) {
    throw "Properties file not found: $PropertiesFile"
}

$propertiesContent = Get-Content $PropertiesFile -Raw
$dockerHubUsername = Get-PropertyValue -Content $propertiesContent -Key "dockerHubUsername"
$dockerHubPassword = Get-PropertyValue -Content $propertiesContent -Key "dockerHubPassword"
$dockerRepoUrl = Get-PropertyValue -Content $propertiesContent -Key "dockerRepoUrl"

if ([string]::IsNullOrWhiteSpace($dockerHubUsername)) {
    throw "dockerHubUsername not found in $PropertiesFile"
}
if ([string]::IsNullOrWhiteSpace($dockerHubPassword)) {
    throw "dockerHubPassword not found in $PropertiesFile"
}
if ([string]::IsNullOrWhiteSpace($dockerRepoUrl)) {
    $dockerRepoUrl = $dockerHubUsername
}

$frontendImage = "$dockerRepoUrl/chat-bot:$Tag"

Write-Host "Docker login check..." -ForegroundColor Cyan
docker info | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw "Docker daemon is not available. Please start Docker Desktop and try again."
}

Write-Host "Docker Hub login..." -ForegroundColor Cyan
$dockerHubPassword | docker login --username $dockerHubUsername --password-stdin
if ($LASTEXITCODE -ne 0) {
    throw "Docker Hub login failed."
}

Write-Host "Building frontend image: $frontendImage" -ForegroundColor Yellow
docker build `
  -t $frontendImage `
  -f Dockerfile `
  --build-arg VITE_API_URL=$FrontendApiUrl `
  .
if ($LASTEXITCODE -ne 0) {
    throw "Frontend docker build failed. Image push skipped."
}

Write-Host "Pushing frontend image..." -ForegroundColor Green
docker push $frontendImage
if ($LASTEXITCODE -ne 0) {
    throw "Frontend docker push failed."
}

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "Frontend: $frontendImage"

