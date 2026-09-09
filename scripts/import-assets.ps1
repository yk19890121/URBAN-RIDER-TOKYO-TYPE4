$ErrorActionPreference = "Stop"
$sourceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$targetRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

$sourceData = Join-Path $sourceRoot "src"
$sourceImages = Join-Path $sourceRoot "public\images"
$sourceFonts = Join-Path $sourceRoot "public\fonts"
$targetData = Join-Path $targetRoot "src"
$targetImages = Join-Path $targetRoot "public\images"
$targetFonts = Join-Path $targetRoot "public\fonts"

New-Item -ItemType Directory -Force -Path $targetData, $targetImages, $targetFonts | Out-Null

Copy-Item -LiteralPath (Join-Path $sourceData "products.json") -Destination (Join-Path $targetData "products.json")
Copy-Item -LiteralPath (Join-Path $sourceData "assets.json") -Destination (Join-Path $targetData "assets.json")
Copy-Item -LiteralPath (Join-Path $sourceData "collections.mjs") -Destination (Join-Path $targetData "collections.mjs")
Copy-Item -Path (Join-Path $sourceImages "*.webp") -Destination $targetImages
Copy-Item -Path (Join-Path $sourceFonts "Anton-*") -Destination $targetFonts
Copy-Item -Path (Join-Path $sourceFonts "BebasNeue-*") -Destination $targetFonts

Write-Host "Authorized URT assets imported."
