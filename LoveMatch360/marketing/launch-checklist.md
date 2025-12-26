# 🚀 Launch Checklist – LoveMatch360

Checklist finale prima della messa online ufficiale della piattaforma.

---

## ✅ 1. Verifiche tecniche essenziali

- [ ] Dominio configurato correttamente (es. www.lovematch360.com)
- [ ] HTTPS attivo (SSL configurato correttamente)
- [ ] Redirect http → https
- [ ] Redirect www → root (o viceversa)
- [ ] Ambiente `prod` attivo (nessuna variabile di test)
- [ ] Modalità debug disattivata
- [ ] Protezione endpoint attiva (Supabase RLS confermato)

---

## 🧪 2. Test di qualità completati

- [ ] ✅ WCAG 2.2 AA → accessibilità testata
- [ ] ✅ SEO → meta tag, descrizioni, schema.org
- [ ] ✅ Performance → LCP < 2.5s, Lighthouse ≥ 90
- [ ] ✅ Responsività su mobile e tablet

---

## 📊 3. Monitoraggio attivo

- [ ] Google Search Console verificata
- [ ] Analytics attivo (GA4, Plausible o PostHog)
- [ ] Eventi chiave tracciati (signup, like, match, message, purchase)
- [ ] Logging errori (Sentry o Vercel logs)

---

## 💳 4. Pagamenti online

- [ ] Stripe configurato in modalità `live`
- [ ] Paywall testato su più browser
- [ ] Conferma invio webhook Stripe
- [ ] Email/Notifiche post-acquisto funzionanti

---

## 📨 5. Domande utili prima del GO LIVE

- [ ] Il team sa cosa succede se qualcosa va storto?
- [ ] Abbiamo una procedura di rollback pronta?
- [ ] L’assistenza è attiva per il lancio?
- [ ] Gli account admin sono stati testati?

---

## 📌 6. Backup e sicurezza

- [ ] Backup dati utenti prima del deploy
- [ ] Nessun account con permessi globali aperti
- [ ] Controlli di accesso verificati su Supabase (RLS)
- [ ] Rotazione chiavi API sensibili completata

---

## ✅ OK FINALE

- [ ] Team approva il rilascio
- [ ] QA firma il via libera
- [ ] Git tag/versione aggiornata (es. `v1.0.0`)
- [ ] Deploy su Vercel eseguito e testato
- [ ] Annuncio pubblico pianificato

---

Pronti al lancio 🚀

