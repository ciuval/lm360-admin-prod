import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';

import PremiumCheckoutTest from './pages/PremiumCheckoutTest.jsx'; // se esiste; altrimenti resta inutilizzato
import PremiumArea from './pages/PremiumArea.jsx';
import RequirePremium from './components/RequirePremium.jsx';

function Home(){
  return (
    <div style={{display:'grid',placeItems:'center',minHeight:'100vh',background:'#111',color:'#eee',fontFamily:'system-ui',gap:'16px'}}>
      <h1>LoveMatch360 — router minimo</h1>
      <nav style={{display:'flex',gap:12}}>
        <Link to='/premium' style={{color:'#9cf'}}>Premium</Link>
        <Link to='/premium-area' style={{color:'#9cf'}}>Area Premium (protetta)</Link>
        <Link to='/premium-checkout-test' style={{color:'#9cf'}}>Checkout Test</Link>
        <a href='#/dev-auth' style={{color:'#9cf'}}>Dev Auth</a>
      </nav>
    </div>
  );
}

function Premium(){
  const query = (window.location.hash.split('?')[1] ?? '');
  const params = new URLSearchParams(query);
  const status = params.get('status');
  return (
    <main style={{padding:'24px',maxWidth:880,margin:'40px auto',lineHeight:1.6,color:'#eee'}}>
      {status === 'success' && (
        <div style={{background:'#0b7d2b',padding:'12px 16px',borderRadius:6,marginBottom:16}}>
          Pagamento completato. Stiamo aggiornando il tuo account… <a href='#/premium' style={{color:'#eafff5',textDecoration:'underline'}}>Torna alla pagina Premium</a>
        </div>
      )}
      <h1 style={{margin:'0 0 12px'}}>Premium</h1>
      <p style={{opacity:.9}}>Area Premium — Demo</p>
      <p><a href='#/premium-checkout-test' style={{color:'#9cf'}}>Vai al checkout test</a></p>
      <p><a href='#/premium-area' style={{color:'#9cf'}}>Vai all’Area Premium protetta</a></p>
    </main>
  );
}

export default function App(){
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/premium' element={<Premium/>} />
        <Route path='/premium-checkout-test' element={<PremiumCheckoutTest/>} />
        <Route
          path='/premium-area'
          element={
            <RequirePremium>
              <PremiumArea/>
            </RequirePremium>
          }
        />
        <Route path='*' element={<Home/>} />
      </Routes>
    </HashRouter>
  );
}
