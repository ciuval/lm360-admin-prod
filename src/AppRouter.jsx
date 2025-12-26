import React from 'react';
import RouteTracker from './components/RouteTracker.jsx';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import './styles/ui.css';
import './styles/a11y.css';
import Paywall from './pages/Paywall.jsx';
const AdminLogs = React.lazy(() => import('./pages/AdminLogs.jsx'));
// Pagine minime (se le tue esistono giÃƒÆ’Ã‚Â , lascia le tue import)
const Home = React.lazy(() => import('./pages/Home.jsx'));
const Consigli = React.lazy(() => import('./pages/Consigli.jsx'));
const Chat = React.lazy(() => import('./pages/Chat.jsx'));
const Profilo = React.lazy(() => import('./pages/Profilo.jsx'));
const Admin = React.lazy(() => import('./pages/AdminLogs.jsx'));
<RouteTracker />;
export default function AppRouter() {
  return (
    <HashRouter>
      <NavBar />
      <div className="container">
        <React.Suspense fallback={<div className="card">CaricamentoÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦</div>}>
          <Routes>
            <Route path="/paywall" element={<Paywall />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/consigli" element={<Consigli />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profilo" element={<Profilo />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
            <Route path="/admin-logs" element={<AdminLogs />} />
          </Routes>
        </React.Suspense>
      </div>
    </HashRouter>
  );
}
