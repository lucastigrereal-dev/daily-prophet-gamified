# Script para criar ZIP do Daily Prophet para deploy no Vercel
# Execute: .\criar-zip-deploy.ps1

Write-Host "📦 CRIANDO ZIP PARA DEPLOY NO VERCEL..." -ForegroundColor Cyan
Write-Host ""

# Nome do arquivo ZIP
$zipName = "daily-prophet-deploy.zip"
$zipPath = Join-Path $PSScriptRoot $zipName

# Remover ZIP antigo se existir
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
    Write-Host "🗑️  Removendo ZIP antigo..." -ForegroundColor Yellow
}

# Criar pasta temporária
$tempFolder = Join-Path $PSScriptRoot "temp-deploy"
if (Test-Path $tempFolder) {
    Remove-Item $tempFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $tempFolder | Out-Null

Write-Host "📁 Copiando arquivos essenciais..." -ForegroundColor Green

# Copiar pastas necessárias
$folders = @("src", "public")
foreach ($folder in $folders) {
    $source = Join-Path $PSScriptRoot $folder
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $tempFolder -Recurse -Force
        Write-Host "   ✅ $folder" -ForegroundColor Green
    }
}

# Copiar arquivos raiz necessários
$files = @(
    "package.json",
    "package-lock.json",
    "next.config.js",
    "tsconfig.json",
    "tailwind.config.js",
    "postcss.config.js",
    "vercel.json",
    "README.md",
    ".gitignore"
)

foreach ($file in $files) {
    $source = Join-Path $PSScriptRoot $file
    if (Test-Path $source) {
        Copy-Item -Path $source -Destination $tempFolder -Force
        Write-Host "   ✅ $file" -ForegroundColor Green
    }
}

# Criar .env.example para referência (NÃO incluir .env.local por segurança)
$envExample = @"
# Variáveis de Ambiente - Daily Prophet Gamified
# Configure estas variáveis no Vercel Dashboard

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
"@

Set-Content -Path (Join-Path $tempFolder ".env.example") -Value $envExample
Write-Host "   ✅ .env.example" -ForegroundColor Green

Write-Host ""
Write-Host "🗜️  Comprimindo arquivos..." -ForegroundColor Cyan

# Criar ZIP
Compress-Archive -Path "$tempFolder\*" -DestinationPath $zipPath -Force

# Limpar pasta temporária
Remove-Item $tempFolder -Recurse -Force

# Verificar tamanho
$zipSize = (Get-Item $zipPath).Length / 1MB
$zipSizeFormatted = "{0:N2} MB" -f $zipSize

Write-Host ""
Write-Host "✅ ZIP CRIADO COM SUCESSO!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Informações:" -ForegroundColor Cyan
Write-Host "   Arquivo: $zipName" -ForegroundColor White
Write-Host "   Tamanho: $zipSizeFormatted" -ForegroundColor White
Write-Host "   Local: $zipPath" -ForegroundColor White
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Acesse: https://vercel.com/new" -ForegroundColor White
Write-Host "2. Arraste o arquivo: $zipName" -ForegroundColor White
Write-Host "3. Adicione as variáveis de ambiente:" -ForegroundColor White
Write-Host "   NEXT_PUBLIC_SUPABASE_URL = https://damxbdkteskryonvgvpc.supabase.co" -ForegroundColor Gray
Write-Host "   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc..." -ForegroundColor Gray
Write-Host "4. Clique em Deploy!" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Pressione qualquer tecla para abrir a pasta..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Abrir pasta no Explorer
Invoke-Item $PSScriptRoot
