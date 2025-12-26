// test-email.js

import { sendPremiumWelcome } from './emails/sendPremiumWelcome.js';
import { sendCancelNotice } from './emails/sendCancelNotice.js';

// Scegli l'email del destinatario (puoi usare anche la tua)
const testEmail = 'inserisci@email.com';

// Scommenta UNO dei due test per provare

// ✅ TEST: Email Premium Attivato
sendPremiumWelcome(testEmail);

// ✅ TEST: Email Disdetta
// sendCancelNotice(testEmail);

