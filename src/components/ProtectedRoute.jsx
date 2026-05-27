import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, userId, user }) {
  const location = useLocation();
  const effectiveUserId = userId || user?.id || null;

  if (!effectiveUserId) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search + location.hash,
        }}
      />
    );
  }

  return children;
}
