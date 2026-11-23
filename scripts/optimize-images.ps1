Add-Type -AssemblyName System.Drawing
$assetRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../client/public'))
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -EQ 'image/jpeg'
foreach ($name in @('bank', 'portfolio', 'csms', 'cyber', 'ecommerce', 'cloud', 'about_profile')) {
    $source = if ($name -eq 'about_profile') { "$name.jpg" } else { "$name.png" }
    $image = [System.Drawing.Image]::FromFile((Join-Path $assetRoot $source))
    $targetWidth = if ($name -eq 'about_profile') { 560 } else { 900 }
    $width = [Math]::Min($targetWidth, $image.Width)
    $height = [int][Math]::Round($image.Height * $width / $image.Width)
    $bitmap = New-Object System.Drawing.Bitmap($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.Clear([System.Drawing.Color]::FromArgb(24,34,37))
    $graphics.DrawImage($image, 0, 0, $width, $height)
    $parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
    $bitmap.Save((Join-Path $assetRoot "$name-optimized.jpg"), $encoder, $parameters)
    $parameters.Dispose(); $graphics.Dispose(); $bitmap.Dispose(); $image.Dispose()
}
Get-ChildItem $assetRoot -Filter '*-optimized.jpg' | Select-Object Name,Length
