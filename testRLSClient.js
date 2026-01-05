import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const email = 'vale-test@example.com';
const password = 'ValeTest123!';

const test = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return console.log('❌ Login:', error.message);
  console.log('✅ Login OK:', data.user.email);
};

test();

