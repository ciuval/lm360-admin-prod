# Funnel di attivazione — checklist

## Automatico

- `npm test`
- `npm run build`
- nessuna PII nei payload analytics o nei log console
- `/scopri-profili` protetta da autenticazione e profilo completo
- profili incompleti esclusi dai risultati discovery
- primo like protetto da richieste concorrenti

## Produzione pubblica

1. Home: la CTA “Crea il tuo spazio” apre `#/register`.
2. Registrazione: la CTA resta disabilitata finché email, password e consenso non sono validi.
3. Termini e Privacy: si aprono in una nuova scheda e il modulo resta intatto.
4. Ospite su `#/scopri-profili`: redirect a `#/login`.

## Prova manuale con nuova email

1. Accettare analytics per rendere visibili gli eventi del test.
2. Creare un account dalla pagina `#/register`.
3. Verificare la schermata “Manca un solo gesto”.
4. Aprire l’email e confermare l’indirizzo.
5. Verificare il ritorno a `#/login?verified=1` e il passaggio automatico al profilo quando Supabase apre già la sessione.
6. Se la sessione non viene aperta automaticamente, accedere e controllare il redirect a `#/profilo`.
7. Provare ad aprire `#/scopri-profili` con profilo incompleto: deve tornare al profilo.
8. Compilare nome, bio di almeno 20 caratteri, interessi e foto; salvare.
9. Verificare il redirect automatico a `#/scopri-profili`.
10. Premere rapidamente due volte “Mi piace”: deve essere registrato un solo like.

## Eventi attesi, solo con consenso analytics

- `registration_viewed`
- `registration_form_started`
- `registration_submitted`
- `email_confirmation_landed`
- `email_confirmed`
- `login_success`
- `profile_started`
- `profile_saved`
- `profile_completed`
- `activation_completed` — compatibilità con la metrica precedente
- `discovery_opened`
- `like_sent`
- `first_like_sent` — soltanto se non esistevano like precedenti

Gli eventi del percorso condividono `flow` e `signup_elapsed_seconds`. `flow` è casuale,
non contiene email o identificatori account e scade dopo sette giorni.

## Rollback

La patch deve restare in un singolo commit. Per annullarla in modo tracciabile:

```powershell
git revert <SHA_COMMIT_FUNNEL>
git push origin main
```
