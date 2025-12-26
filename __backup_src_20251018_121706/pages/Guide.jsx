import React from 'react';

export default function Guide() {
  const box = {maxWidth: 920, margin: '0 auto', padding: '24px', lineHeight: 1.5};
  const page = {minHeight:'calc(100vh - 50px)', background:'#111', color:'#eee', fontFamily:'system-ui'};
  const link = {color:'#9cf', textDecoration:'none'};

  return (
    <div style={page}>
      <div style={box}>
        <h2 style={{marginTop: 0}}>Guide — stub OK</h2>
        <p>Questa è una pagina di prova per rimettere i componenti in modo sicuro.</p>
        <p>
          <a href="#/premium-checkout-test" style={link}>Vai al checkout test</a> ·{" "}
          <a href="#/premium" style={link}>Premium</a>
        </p>
      </div>
    </div>
  );
}
