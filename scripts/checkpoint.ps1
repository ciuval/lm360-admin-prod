param([string]$Msg="checkpoint")
git add -A
git commit -m "[CKPT] $Msg"
$tag = "ckpt_" + (Get-Date -Format "yyyyMMdd_HHmmss")
git tag $tag
Write-Host "Checkpoint creato: $tag" -ForegroundColor Green
