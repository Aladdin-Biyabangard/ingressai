<#
.SYNOPSIS
  Docker build + push. Project settings: docker-publish.properties (or -ConfigFile).

.EXAMPLE
  .\docker-publish.ps1 -Tag v0.0.1
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$Tag,

    [Parameter(Mandatory = $false)]
    [string]$ConfigFile = "docker-publish.properties",

    [Parameter(Mandatory = $false)]
    [string]$Dockerfile = "Dockerfile",

    [Parameter(Mandatory = $false)]
    [string]$Context = "."
)

$ErrorActionPreference = "Stop"

function Get-PropertyValue {
    param([string]$Content, [string]$Key)
    $pattern = "(?m)^\s*$([regex]::Escape($Key))\s*=\s*(.+)\s*$"
    $match = [regex]::Match($Content, $pattern)
    if ($match.Success) {
        return $match.Groups[1].Value.Trim()
    }
    return $null
}

function Get-ViteBuildArgs {
    param([string]$Content)
    $out = @()
    foreach ($line in $Content -split "`r?`n") {
        $t = $line.Trim()
        if ($t -match '^\s*#' -or [string]::IsNullOrWhiteSpace($t)) { continue }
        if ($t -match '^\s*(VITE_[A-Za-z0-9_]+)\s*=\s*(.*)$') {
            $name = $matches[1]
            $val = $matches[2].Trim()
            if (-not [string]::IsNullOrWhiteSpace($val)) {
                $out += "--build-arg"
                $out += "${name}=$val"
            }
        }
    }
    return $out
}

if (!(Test-Path $ConfigFile)) {
    $example = "docker-publish.properties.example"
    if (Test-Path $example) {
        Copy-Item -Path $example -Destination $ConfigFile
        throw @"
Created $ConfigFile from $example.

Edit dockerHubUsername, dockerHubPassword, and imageName (and VITE_* URLs if needed), then run:

  .\docker-publish.ps1 -Tag $Tag
"@
    }
    throw "Missing $ConfigFile. Add it or copy docker-publish.properties.example to $ConfigFile."
}

$cfg = Get-Content $ConfigFile -Raw -Encoding UTF8

$dockerHubUsername = Get-PropertyValue -Content $cfg -Key "dockerHubUsername"
$dockerHubPassword = Get-PropertyValue -Content $cfg -Key "dockerHubPassword"
$dockerRepoUrl = Get-PropertyValue -Content $cfg -Key "dockerRepoUrl"
$imageName = Get-PropertyValue -Content $cfg -Key "imageName"

if (
    [string]::IsNullOrWhiteSpace($dockerHubUsername) -or
    [string]::IsNullOrWhiteSpace($dockerHubPassword)
) {
    if (
        -not [string]::IsNullOrWhiteSpace($env:DOCKER_USERNAME) -and
        -not [string]::IsNullOrWhiteSpace($env:DOCKER_PASSWORD)
    ) {
        $dockerHubUsername = $env:DOCKER_USERNAME.Trim()
        $dockerHubPassword = $env:DOCKER_PASSWORD
        if ([string]::IsNullOrWhiteSpace($dockerRepoUrl) -and -not [string]::IsNullOrWhiteSpace($env:DOCKER_REPO)) {
            $dockerRepoUrl = $env:DOCKER_REPO.Trim()
        }
    }
}

if ([string]::IsNullOrWhiteSpace($dockerHubUsername) -or [string]::IsNullOrWhiteSpace($dockerHubPassword)) {
    throw "Set dockerHubUsername and dockerHubPassword in $ConfigFile, or set DOCKER_USERNAME and DOCKER_PASSWORD in the environment."
}

if ([string]::IsNullOrWhiteSpace($imageName)) {
    throw "Set imageName in $ConfigFile (e.g. ingressai)."
}

if ([string]::IsNullOrWhiteSpace($dockerRepoUrl)) {
    $dockerRepoUrl = $dockerHubUsername
}

$fullImage = "${dockerRepoUrl}/${imageName}:${Tag}"

Write-Host "Docker login check..." -ForegroundColor Cyan
$dockerInfo = Start-Process -FilePath "docker" -ArgumentList "info" -NoNewWindow -Wait -PassThru
if ($dockerInfo.ExitCode -ne 0) {
    throw @"
Docker Engine is not running. Start Docker Desktop, then run: docker version

Or build without Docker: npm run build
"@
}

Write-Host "Docker Hub login..." -ForegroundColor Cyan
$dockerHubPassword | docker login --username $dockerHubUsername --password-stdin
if ($LASTEXITCODE -ne 0) {
    throw "Docker Hub login failed."
}

$viteBuildArgs = Get-ViteBuildArgs -Content $cfg
if ($viteBuildArgs.Count -eq 0) {
    Write-Warning "No VITE_* keys found in $ConfigFile. Add them if your Dockerfile expects build-args."
}

$buildArgs = @(
    "-t", $fullImage,
    "-f", $Dockerfile
) + $viteBuildArgs + $Context

Write-Host "Building: $fullImage" -ForegroundColor Yellow
for ($i = 0; $i -lt $viteBuildArgs.Count; $i += 2) {
    if ($viteBuildArgs[$i] -eq "--build-arg" -and ($i + 1) -lt $viteBuildArgs.Count) {
        Write-Host "  $($viteBuildArgs[$i + 1])" -ForegroundColor DarkGray
    }
}

docker build @buildArgs
if ($LASTEXITCODE -ne 0) {
    throw "docker build failed."
}

Write-Host "Pushing..." -ForegroundColor Green
docker push $fullImage
if ($LASTEXITCODE -ne 0) {
    throw "docker push failed."
}

Write-Host ""
Write-Host "Done: $fullImage" -ForegroundColor Green
