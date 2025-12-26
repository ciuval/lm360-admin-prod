// src/config/menu.js
// Una sola fonte di verità. Le voci vengono filtrate da ruolo/premium.
export const MENU = [
  { key: 'home', label: 'Home', to: '/home', icon: '🏠', roles: ['guest', 'user', 'mod', 'admin'] },
  {
    key: 'consigli',
    label: 'Consigli',
    to: '/consigli',
    icon: '💡',
    roles: ['guest', 'user', 'mod', 'admin'],
  },
  {
    key: 'discover',
    label: 'Scopri',
    to: '/discover',
    icon: '✨',
    roles: ['guest', 'user', 'mod', 'admin'],
  },
  // Chat: visibile a tutti, ma con gate premium lato pagina/rotta
  {
    key: 'chat',
    label: 'Chat',
    to: '/chat',
    icon: '💬',
    roles: ['guest', 'user', 'mod', 'admin'],
    badgeKey: 'unread',
  },
  // Profilo solo utenti loggati
  { key: 'profilo', label: 'Profilo', to: '/profilo', icon: '👤', roles: ['user', 'mod', 'admin'] },
  // Admin solo admin
  { key: 'admin', label: 'Admin', to: '/admin', icon: '🛠️', roles: ['admin'] },
];

export const CTA = {
  // CTA a destra: abbonamento premium
  label: 'Premium',
  to: '/premium',
};
