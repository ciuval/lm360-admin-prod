# test-trigger-profili-rollback.ps1
# Riporta lo stato a active + premium (per lasciare l'utente pronto ai test live)

cd "$HOME\Downloads\lm360-admin-prod\lm360-admin-prod"

# Env
$URL = ((Select-String -Path .env -Pattern '^SUPABASE_URL=').Line -split '=',2)[1].Trim()
$SR  = ((Select-String -Path .env -Pattern '^SUPABASE_SERVICE_ROLE_KEY=').Line -split '=',2)[1].Trim()
$Hjson = @{apikey=$SR;Authorization="Bearer $SR";"Content-Type"="application/json";Prefer="return=representation"}
$Hsel  = @{apikey=$SR;Authorization="Bearer $SR"}

# Utente di test
$UID   = "6895d2d1-8476-49fa-b569-6be8b8f119a4"
$EMAIL = "test@lovematch360.com"

Write-Host "`n=== ROLLBACK: abbonamenti.status -> active ===" -ForegroundColor Cyan
Invoke-RestMethod -Method PATCH -Headers $Hjson -Uri "$URL/rest/v1/abbonamenti?user_id=eq.$UID" -Body '{"status":"active"}' | Out-Null
Start-Sleep -Seconds 2

Write-Host "`n=== Verifico profili (ruolo) ===" -ForegroundColor Cyan
$prof = Invoke-RestMethod -Headers $Hsel -Uri "$URL/rest/v1/profili?select=id,email,ruolo&email=eq.$EMAIL"
$prof

Write-Host "`n=== FINE ROLLBACK (atteso: ruolo=premium) ===" -ForegroundColor Green
