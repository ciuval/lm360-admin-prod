import React from "react";
export default class ErrorBoundary extends React.Component{
  constructor(p){super(p);this.state={hasError:false,error:null}}
  static getDerivedStateFromError(error){return {hasError:true,error}}
  render(){
    if(this.state.hasError){
      return <div style={{padding:"2rem",color:"#fff",background:"#1e1e1e"}}>
        <h2>Si è verificato un errore in App</h2>
        <pre style={{whiteSpace:"pre-wrap"}}>{String(this.state.error)}</pre>
      </div>;
    }
    return this.props.children;
  }
}
