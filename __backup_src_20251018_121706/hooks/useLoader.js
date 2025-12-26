/* src/hooks/useLoader.js */
let _counter = 0;
const fire = (name) => { try { window.dispatchEvent(new Event(name)); } catch {} };

export function ldOn(){ fire("ld-start"); }
export function ldOff(){ fire("ld-stop"); }

export function useLoader(){
  const start = () => { _counter++; ldOn(); };
  const stop  = () => { _counter = Math.max(0,_counter-1); if(_counter===0) ldOff(); };
  const withAsync = async (fn) => { start(); try { return await fn(); } finally { stop(); } };
  return { start, stop, withAsync };
}
