import React from 'react';
import * as M from './Discover.jsx';

const Page = M.default || M.Discover || (() => (
  <main style={{padding:24}}>Scopri — in arrivo</main>
));

export default Page;