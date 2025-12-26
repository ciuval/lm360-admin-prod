// src/router.jsx
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Premium from './pages/Premium.jsx';
import Login from './pages/Login.jsx';
import Account from './pages/Account.jsx';
import Profile from './pages/Profile.jsx';
import Chat from './pages/Chat.jsx'; // ← NEW
import LabMatch from './pages/LabMatch.jsx'; // (già previsto)
import YoutubeMoney from './pages/pay/YoutubeMoney.jsx';
import AmazonSales from './pages/pay/AmazonSales.jsx';
import Discover from './pages/_Discover.auto.jsx'; // se presente
import Navbar from './components/Navbar.jsx';
import Toast from './components/Toast.jsx';
import { AuthProvider, AuthGuard } from './lib/authContext.jsx';

export default function AppRouter() {
  return (
    <AuthProvider>
      <HashRouter>
        <Navbar />
        <Toast />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/lab-match" element={<LabMatch />} />
          <Route path="/p/youtube-money" element={<YoutubeMoney />} />
          <Route path="/p/amazon-sales" element={<AmazonSales />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/premium" element={<Premium />} />
          <Route
            path="/account"
            element={
              <AuthGuard>
                <Account />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            }
          />
          <Route
            path="/chat"
            element={
              <AuthGuard>
                <Chat />
              </AuthGuard>
            }
          />{' '}
          {/* NEW */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

