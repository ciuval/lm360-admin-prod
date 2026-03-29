import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAccountTier from "../hooks/useAccountTier";

export default function RequireAdmin({ children, redirectTo = "/" }) {
  const location = useLocation();
  const { loading, isAuthed, tier } = useAccountTier(location.pathname);

  const from = location.pathname + location.search + location.hash;

  if (loading) return null;

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from }} />;
  }

  if (tier !== "admin") {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from, adminRequired: true }}
      />
    );
  }

  return children;
}