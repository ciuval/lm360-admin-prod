import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError:false, err:null } }
  static getDerivedStateFromError(err){ return { hasError:true, err } }
  componentDidCatch(err, info){ console.error('ErrorBoundary', err, info) }
  render(){
    if (this.state.hasError) {
      return (
        <div className="lm360-error">
          <h2>Qualcosa è andato storto.</h2>
          <pre>{String(this.state.err?.message || this.state.err)}</pre>
          <button onClick={()=>location.reload()}>Ricarica</button>
        </div>
      )
    }
    return this.props.children
  }
}
