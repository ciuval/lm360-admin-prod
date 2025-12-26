import { useEffect } from 'react';
export default function GlobalErrorSilencer(){
  useEffect(()=>{
    const onrej = (e)=>{
      const msg = String(e.reason?.message || e.reason || '');
      if (/Failed to fetch|NetworkError|TypeError: Failed to fetch/i.test(msg)) {
        e.preventDefault?.();
      }
    };
    window.addEventListener('unhandledrejection', onrej);
    return ()=>window.removeEventListener('unhandledrejection', onrej);
  },[]);
  return null;
}
