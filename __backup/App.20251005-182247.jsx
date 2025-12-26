import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Premium from './pages/Premium.jsx';
import PremiumCheckoutTest from './pages/PremiumCheckoutTest.jsx';
import Header from './components/Header.jsx';

function Home(){
  return (
    <div style={{display:'grid',placeItems:'center',minHeight:'100vh',background:'#111',color:'#eee',fontFamily:'system-ui',gap:'16px'}}>
      <h1>LoveMatch360 — router minimo</h1>
      <nav style={{display:'flex',gap:12}}>
        <Link to='/premium' style={{color:'#9cf'}}>Premium</Link>
        <Link to='/premium-checkout-test' style={{color:'#9cf'}}>Checkout Test</Link>
        <a href='#/dev-auth' style={{color:'#9cf'}}>Dev Auth</a>
      </nav>
    </div>
  );
}

export default function App(){
  return (
    <HashRouter>
      <Header />
        <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/premium' element={<Premium/>} />
        <Route path='/premium-checkout-test' element={<PremiumCheckoutTest/>} />
        <Route path='*' element={<Home/>} />
      </Routes>
    </HashRouter>
  );
}

