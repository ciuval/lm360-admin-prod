# LoveMatch360 — prepara SOLO I:\lm360-clean\LM360_FASE2_LAB
# Non chiama Docker, Supabase remoto, SQL Editor o servizi cloud.
# Non modifica main né i file già pubblicati della migrazione Stanza.
# PowerShell 5.1+
$ErrorActionPreference = 'Stop'

$lab = 'I:\lm360-clean\LM360_FASE2_LAB'
$expectedBranch = 'integration/quality-gate-20261112'

if (-not (Test-Path -LiteralPath $lab -PathType Container)) {
    throw 'LAB_NOT_FOUND'
}
if (-not (Test-Path -LiteralPath (Join-Path $lab '.git') -PathType Container)) {
    throw 'NOT_A_STANDALONE_GIT_CLONE'
}

$branch = (& git -C $lab branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne $expectedBranch) {
    throw 'INCORRECT_BRANCH_OR_REPOSITORY'
}

$source = Join-Path $lab 'scripts\local-only\20260910_lm360_core_lab.sql'
$destination = Join-Path $lab 'supabase\migrations\20260910_lm360_core_lab.sql'
$config = Join-Path $lab 'supabase\config.toml'
$stanza = Join-Path $lab 'supabase\migrations\20260911_stanza_360.sql'

foreach ($required in @($source, $config, $stanza)) {
    if (-not (Test-Path -LiteralPath $required -PathType Leaf)) {
        throw 'LAB_REQUIRED_FILE_MISSING'
    }
}

# Nessun file locale preesistente viene sovrascritto.
if (Test-Path -LiteralPath $destination) {
    $expected = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash
    $actual = (Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash
    if ($expected -ne $actual) {
        throw 'LOCAL_BASELINE_EXISTS_WITH_DIFFERENT_CONTENT'
    }
    Write-Host 'Baseline locale già presente e identica. Nessuna sovrascrittura.'
}
else {
    Copy-Item -LiteralPath $source -Destination $destination -ErrorAction Stop
    Write-Host 'Baseline locale predisposta prima della migrazione Stanza 360.'
}

# Protegge la copia di test dal commit accidentale.
$exclude = Join-Path $lab '.git\info\exclude'
$relative = 'supabase/migrations/20260910_lm360_core_lab.sql'
if (-not (Select-String -LiteralPath $exclude -SimpleMatch -Quiet -Pattern $relative -ErrorAction SilentlyContinue)) {
    Add-Content -LiteralPath $exclude -Value ([Environment]::NewLine + '# LoveMatch360: baseline SOLO locale, MAI distribuire' + [Environment]::NewLine + $relative)
}
Write-Host '===== BASELINE LABORATORIO ====='
Write-Host "Branch: $branch"
Write-Host ('SHA256 coincide: ' + ((Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash -eq (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash))
Write-Host ('Configurazione locale: ' + (Test-Path -LiteralPath $config))
Write-Host ('Migrazione Stanza 360: ' + (Test-Path -LiteralPath $stanza))
Write-Host '===== PREPARAZIONE COMPLETATA ====='
Write-Host 'Non eseguire ancora supabase start: prima verificare la preparazione e le dipendenze.'
