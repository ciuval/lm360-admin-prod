# LoveMatch360 — gate qualità frontend e backend (10 novembre 2026)

## Scopo
Questo documento accompagna la PR di allineamento del frontend. La modifica **non rende operativa la chat** e non sostituisce un test di autorizzazione lato database.

## Contratto minimo verificabile
- Il frontend non scrive o aggiorna mai direttamente il punteggio di un match.
- Il like è un'intenzione dell'utente, non prova di reciprocità.
- Il backend stabilisce se esiste reciprocità e ne produce un esito verificabile.
- Quando una RPC, una query o un controllo di autorizzazione fallisce, la chat non si apre e l'utente riceve un messaggio neutrale.
- Il frontend legge solo i campi realmente definiti dal database.
- In assenza di profili non viene dichiarata una visibilità non dimostrata.

## Prima del merge
1. Eseguire `npm ci`, `npm run build:legal`, `npm test`, `npm run build`, `npm run check:legal`.
2. Verificare la PR in anteprima con tastiera e viewport mobile.
3. Confrontare i nomi di colonne e RPC utilizzate nel frontend con lo schema del backend nell'ambiente di prova.
4. Collaudare con **due account sintetici** in un ambiente isolato: like unilaterale, reciprocità, chat consentita e invio negato senza match. Non usare dati reali.
5. Verificare separatamente RLS, permessi di scrittura, trigger e RPC su Supabase. I soli test React non provano la sicurezza del backend.
6. Confermare che Stripe/PayPal e i nuovi checkout rimangano sospesi fino a riesame esplicito del provider.
7. Non dichiarare il servizio pronto o sicuro solo perché la compilazione è riuscita.

## Rilascio e rollback
Solo dopo l'esito dei gate, predisporre rilascio controllato. La PR non crea tabelle o migrazioni SQL.
Rollback frontend: usare il revert della PR specifica e ricontrollare i flussi pubblici. Non modificare direttamente dati o policy di produzione come correzione temporanea.

## Stato
- Modifiche frontend: in bozza, non pubblicate.
- Backend: revisione separata necessaria.
- Pagamenti: sospesi.
