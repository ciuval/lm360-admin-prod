# Stanza 360 — attivazione controllata

## Regole di prodotto

- cinque qualità offerte e cinque cercate, scelte da un vocabolario controllato;
- massimo tre imperfezioni e cinque imperfezioni accettabili;
- porta aperta da 50%, solo dopo interesse reciproco;
- conversazione gratuita e mai sbloccabile tramite Premium;
- nessun profilo, punteggio o messaggio inventato.

## Privacy e sicurezza

- `stanze_360` ha RLS attiva e nessun accesso `anon`;
- ogni utente legge e modifica integralmente soltanto la propria stanza;
- `get_stanza_compatibility()` calcola lato database e restituisce solo punteggio,
  stato della porta e qualità coincidenti;
- `send_stanza_message()` ricontrolla sul server compatibilità e interesse reciproco;
- contenuti dei messaggi e identificativi non entrano negli eventi analytics.

## Attivazione database

Eseguire una sola volta, nel progetto Supabase di produzione, il file:

`supabase/migrations/20260911_stanza_360.sql`

Prima della migrazione il profilo continua a funzionare e mostra uno stato prudente
"La Stanza 360 sta arrivando". Dopo la migrazione il configuratore diventa operativo.

## Verifica

1. Compilare due stanze con account reali distinti.
2. Verificare che sotto 50% la porta resti chiusa.
3. Verificare che da 50% la porta richieda comunque il like reciproco.
4. Verificare che la chat si apra soltanto quando entrambe le condizioni sono vere.
5. Verificare che l'account free possa inviare e ricevere messaggi.
