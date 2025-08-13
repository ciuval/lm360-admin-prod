import React from "react";
import { Navigate } from "react-router-dom";

const FAKE_ON  = import.meta.env.VITE_ENABLE_FAKE_USER === "true";
const FAKE_ID  = import.meta.env.VITE_FAKE_USER_ID || null;

export default function ProtectedRoute({ userId, children }) {
  const effectiveUser = userId || (FAKE_ON ? FAKE_ID : null);
  if (!effectiveUser) return <Navigate to="/login" replace />;
  return children;
}
