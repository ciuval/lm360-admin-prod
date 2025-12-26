import { getJson, setJson } from '../lib/storage';
import { Navigate } from 'react-router-dom';

export default function RedirectIfLoggedIn({ userId, children }) {
  if (userId) {
    return <Navigate to="/profilo" replace />;
  }
  return children;
}
