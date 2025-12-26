import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import PostDetail from './pages/PostDetail.jsx';
import Consigli from './pages/Consigli.jsx';

export default function App() {
  return (
    <HashRouter>
      <div style={{minHeight:'100vh', padding:'24px'}}>
        <nav style={{display:'flex', gap:12, marginBottom:16}}>
          <Link to="/">Home</Link>
          <Link to="/consigli">Consigli</Link>
        </nav>
        <Routes>
          <Route path="/" element={<div>Home OK</div>} />
          <Route path="/consigli" element={<Consigli />} />
          <Route path="*" element={<div>Pagina non trovata</div>} />
          <Route path="/post/:id" element={<PostDetail />} />`r`n</Routes>
      </div>
    </HashRouter>
  );
}




