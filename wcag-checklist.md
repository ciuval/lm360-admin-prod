# ✅ Checklist WCAG 2.2 AA – Accessibilità LoveMatch360

Questa checklist documenta gli interventi minimi per garantire la 
conformità agli standard WCAG 2.2 AA nel progetto LoveMatch360.

---

## 🔁 Navigazione da tastiera

- [x] Tutti gli elementi interattivi sono raggiungibili con `Tab`
- [x] I pulsanti e i link ricevono `focus` visibile
- [x] Elementi personalizzati (es. `div`) usano `tabIndex={0}` e 
`onKeyDown`
- [x] Il focus è evidenziato visivamente (outline personalizzato)

---

## 🎨 Contrasto visivo

- [x] Testo chiaro su sfondo scuro (contrasto ≥ 4.5:1)
- [x] Colori dei testi e dei bottoni controllati con [WebAIM Contrast 
Checker](https://webaim.org/resources/contrastchecker)

---

## 🗣️ Supporto screen reader

- [x] Tutti i bottoni hanno `aria-label` descrittivo
- [x] I link sono chiari e semanticamente comprensibili
- [x] Nessun contenuto visuale senza equivalente testuale

---

## 🔘 Interazione accessibile

- [x] `Enter` o `Space` attivano correttamente bottoni e link
- [x] I form non ricaricano la pagina in modo imprevisto 
(`preventDefault()`)
- [x] Nessuna azione invisibile o inattesa alla tastiera

---

## 🍪 Banner dei cookie

- [x] Mostrato solo se non c’è consenso salvato
- [x] Bottoni “Accetta” e “Rifiuta” accessibili e con `aria-label`
- [x] Testo chiaro e informativo sull’uso dei cookie

---

## ✅ Pagine testate manualmente

| Pagina           | Accessibilità testata |
|------------------|------------------------|
| `/` (Home)       | ✅ Sì                   |
| `/profile`       | ✅ Sì                   |
| `/chatpage`      | ✅ Sì                   |
| `/loginpage`     | ✅ Sì                   |

---

## 📌 Verifiche finali consigliate

- [ ] Test con screen reader reale (VoiceOver, NVDA, JAWS)
- [ ] Verifica con Lighthouse → punteggio "Accessibility" > 90
- [ ] Test finale post-deploy su dominio live

---

Pronto per la pubblicazione ✅

