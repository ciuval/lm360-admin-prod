import { getJson, setJson } from '../lib/storage';
// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Compatibile sia con:
 *   <ProtectedRoute userId={id}><Pagina/></ProtectedRoute>
 * che con:
 *   <Route element={<ProtectedRoute userId={id} element={<Pagina/>} />} />
 */
export default function ProtectedRoute({ userId, element, children }) {
  const location = useLocation();

  // non loggato â†’ vai al login, tieni traccia della pagina di origine
  if (!userId) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // se passi element, usa quello; altrimenti usa i children
  return element ?? children ?? null;
}
