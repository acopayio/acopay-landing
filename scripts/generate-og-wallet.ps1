# Compose 1200x630 OG for acopay.net wallet from real Play promo screenshot.
# Requires Windows System.Drawing. Output: public/assets/og-wallet.png
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$W = 1200
$H = 630
$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = "HighQuality"
$g.InterpolationMode = "HighQualityBicubic"
$g.PixelOffsetMode = "HighQuality"
$g.TextRenderingHint = "ClearTypeGridFit"

$c0 = [System.Drawing.Color]::FromArgb(255, 12, 16, 23)
$c1 = [System.Drawing.Color]::FromArgb(255, 14, 36, 48)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (
  [System.Drawing.Rectangle]::new(0, 0, $W, $H),
  $c0,
  $c1,
  [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal
)
$g.FillRectangle($brush, 0, 0, $W, $H)

# Soft cyan glow (left)
$glow = New-Object System.Drawing.Drawing2D.GraphicsPath
$glow.AddEllipse(-80, 80, 520, 420)
$gb = New-Object System.Drawing.Drawing2D.PathGradientBrush $glow
$gb.CenterColor = [System.Drawing.Color]::FromArgb(55, 0, 229, 255)
$gb.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 229, 255))
$g.FillPath($gb, $glow)

$shot = [System.Drawing.Image]::FromFile((Resolve-Path "public\assets\wallet-promo\home.jpg"))
$phoneW = 292
$phoneH = [int]($phoneW * ($shot.Height / $shot.Width))
$phoneX = 790
$phoneY = [int](($H - $phoneH) / 2)
$framePad = 14
$frameBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 8, 10, 14))
$g.FillRectangle($frameBrush, $phoneX - $framePad, $phoneY - $framePad, $phoneW + 2 * $framePad, $phoneH + 2 * $framePad)
$g.DrawImage($shot, $phoneX, $phoneY, $phoneW, $phoneH)
$shot.Dispose()

$logoPath = "public\assets\title-icon-512.png"
if (-not (Test-Path $logoPath)) { $logoPath = "public\assets\logo.png" }
$logo = [System.Drawing.Image]::FromFile((Resolve-Path $logoPath))
$g.DrawImage($logo, 72, 138, 88, 88)
$logo.Dispose()

$fontTitle = New-Object System.Drawing.Font "Segoe UI", 40, ([System.Drawing.FontStyle]::Bold)
$fontTag = New-Object System.Drawing.Font "Segoe UI", 18, ([System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font "Segoe UI", 16, ([System.Drawing.FontStyle]::Regular)
$white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$cyan = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 61, 214, 240))
$muted = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 176, 190, 204))

$g.DrawString("ACOPAY Wallet", $fontTitle, $white, 72, 250)
$g.DrawString("Non-custodial Solana wallet", $fontTag, $cyan, 72, 322)
$g.DrawString("Keys stay on your device. Send & receive.", $fontSub, $muted, 72, 372)
$g.DrawString("acopay.net", $fontSub, $cyan, 72, 520)

$out = Join-Path $root "public\assets\og-wallet.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose(); $bmp.Dispose(); $brush.Dispose(); $gb.Dispose(); $glow.Dispose()
$frameBrush.Dispose(); $white.Dispose(); $cyan.Dispose(); $muted.Dispose()
$fontTitle.Dispose(); $fontTag.Dispose(); $fontSub.Dispose()

$chk = [System.Drawing.Image]::FromFile($out)
Write-Host ("WROTE " + $out + " " + $chk.Width + "x" + $chk.Height + " bytes=" + (Get-Item $out).Length)
$chk.Dispose()
