# Script de Despliegue Automático a Vercel
param(
    [string]$Token = $env:VERCEL_TOKEN
)

$baseDir = $PSScriptRoot
$sha1Provider = New-Object System.Security.Cryptography.SHA1Managed

$excludeRegex = "cloudflared|server\.ps1|Iniciar_Demo|\.log|\.git|\.vercelignore|deploy-vercel\.ps1"
$files = Get-ChildItem -Path $baseDir -Recurse -File | Where-Object { $_.FullName -notmatch $excludeRegex }

$deploymentFiles = @()

Write-Host "Iniciando subida de archivos a Vercel..." -ForegroundColor Cyan

foreach ($f in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $sha1 = $sha1Provider.ComputeHash($bytes)
    $sha1Hex = [System.BitConverter]::ToString($sha1).Replace("-", "").ToLower()
    $relPath = $f.FullName.Substring($baseDir.Length).TrimStart("\", "/").Replace("\", "/")
    
    Write-Host "  -> Subiendo: $relPath" -ForegroundColor Gray
    
    $headers = @{
        "Authorization" = "Bearer $Token"
        "Content-Type" = "application/octet-stream"
        "x-vercel-digest" = $sha1Hex
        "Content-Length" = $bytes.Length
    }
    
    try {
        $null = Invoke-RestMethod -Uri "https://api.vercel.com/v2/files" -Method Post -Headers $headers -Body $bytes
    } catch {
        # Archivo ya presente en Vercel
    }
    
    $deploymentFiles += @{
        "file" = $relPath
        "sha" = $sha1Hex
        "size" = $bytes.Length
    }
}

Write-Host "Creando nuevo despliegue de Producción..." -ForegroundColor Cyan

$deployBody = @{
    "name" = "asistente-precios-web"
    "files" = $deploymentFiles
    "projectSettings" = @{ "framework" = $null }
    "target" = "production"
} | ConvertTo-Json -Depth 5

$deployHeaders = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

try {
    $res = Invoke-RestMethod -Uri "https://api.vercel.com/v13/deployments" -Method Post -Headers $deployHeaders -Body $deployBody
    Write-Host "`n¡DESPLIEGUE EXITOSO EN VERCEL!" -ForegroundColor Green
    Write-Host "URL Pública: https://asistente-precios-web.vercel.app" -ForegroundColor Yellow
    Write-Host "URL Directa: https://$($res.url)" -ForegroundColor Yellow
} catch {
    Write-Host "Error en el despliegue: $($_.Exception.Message)" -ForegroundColor Red
}
