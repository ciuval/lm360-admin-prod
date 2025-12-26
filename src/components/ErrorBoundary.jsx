import { getJson, setJson } from '../lib/storage';
import React from 'react';
export default class ErrorBoundary extends React.Component {
  constructor(p) {
    super(p);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err };
  }
  componentDidCatch(err, info) {
    console.error('UI crash:', err, info);
  }
  render() {
    if (this.state.err) {
      return (
        <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
          <h1>Qualcosa è andato storto</h1>
          <p style={{ opacity: 0.8 }}>Ricarica la pagina. Se persiste, riprova più tardi.</p>
        </main>
      );
    }
    return this.props.children;
  }
}
