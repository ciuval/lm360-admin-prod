import { getJson, setJson } from '../lib/storage';
import React from 'react';

export function usePremium() {
  const [state, setState] = React.useState({
    loading: true,
    premium: false,
    row: null,
    error: null,
  });

  React.useEffect(() => {
    let abort = false;
    (async () => {
      try {
        // DEV: token di sviluppo
        const tokRes = await fetch('/api/dev-get-access-token');
        const tokJson = await tokRes.json();
        const token = tokJson?.access_token ?? '';

        const res = await fetch('/api/my-premium', {
          headers: { Authorization: Bearer },
        });
        const json = await res.json();
        if (!abort) {
          setState({
            loading: false,
            premium: !!json?.premium,
            row: json?.row ?? null,
            error: null,
          });
        }
      } catch (e) {
        if (!abort) {
          setState({ loading: false, premium: false, row: null, error: e });
        }
      }
    })();
    return () => {
      abort = true;
    };
  }, []);

  return state;
}
