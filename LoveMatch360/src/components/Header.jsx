import React from "react";
import { prefetch } from "../lib/prefetch";

export default function Header(){
  const pf = (k)=>()=>prefetch(k);
  const nav = {display:"flex", gap:16, alignItems:"center", flexWrap:"wrap"};
  return (
    <header style={{padding:"12px 16px", borderBottom:"1px solid rgba(0,0,0,0.1)"}}>
      <nav aria-label="Navigazione principale" style={nav}>
        <a href="#/discover" onMouseEnter={pf("discover")} onFocus={pf("discover")}>Scopri</a>
        <a href="#/likes"    onMouseEnter={pf("likes")}    onFocus={pf("likes")}>Like</a>
        <a href="#/matches"  onMouseEnter={pf("matches")}  onFocus={pf("matches")}>Match</a>
        <a href="#/chat"     onMouseEnter={pf("chat")}     onFocus={pf("chat")}>Chat</a>
        <a href="#/premium"  onMouseEnter={pf("premium")}  onFocus={pf("premium")} aria-label="Vai a Premium">Premium</a>
        <span style={{marginLeft:"auto"}}><a href="#/signup" onMouseEnter={pf("signup")} onFocus={pf("signup")}>Iscriviti</a></span>
      </nav>
    </header>
  );
}
