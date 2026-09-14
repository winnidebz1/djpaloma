Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$images = Join-Path $root 'Images'
$output = Join-Path $images 'featured'
New-Item -ItemType Directory -Force -Path $output | Out-Null

$logos = @{
  'mtnlogo.png' = 'mtn.png'
  'aglow ghana.jpg' = 'aglow-ghana.png'
  'omnibisc bank.jpg' = 'omnibisc.png'
  'ofi ghana.png' = 'ofi-ghana.png'
  'Praise tv.jpg' = 'praise-tv.png'
  'hitz fm.png' = 'hitz-fm.png'
  'zylofon media.jpg' = 'zylofon-media.png'
  'kristocentric.jpg' = 'kristocentric.png'
  'footprint tv.jpg' = 'footprint-tv.png'
}

foreach ($entry in $logos.GetEnumerator()) {
  $source = Join-Path $images $entry.Key
  $destination = Join-Path $output $entry.Value
  $bitmap = [System.Drawing.Bitmap]::new($source)
  $corner = $bitmap.GetPixel(0, 0)
  $threshold = 55

  for ($y = 0; $y -lt $bitmap.Height; $y++) {
    for ($x = 0; $x -lt $bitmap.Width; $x++) {
      $pixel = $bitmap.GetPixel($x, $y)
      $distance = [Math]::Sqrt(
        [Math]::Pow($pixel.R - $corner.R, 2) +
        [Math]::Pow($pixel.G - $corner.G, 2) +
        [Math]::Pow($pixel.B - $corner.B, 2)
      )
      if ($distance -le $threshold) {
        $bitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $pixel.R, $pixel.G, $pixel.B))
      }
    }
  }

  $bitmap.Save($destination, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
  Write-Output $entry.Value
}
