import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ Missing Supabase URL or Anon Key in .env');
  process.exit(1);
}

const supabase = createClient(url, key, {
  db: { schema: 'bb_ecommerce_sc' }
});

async function testConnection() {
  console.log(`🔌 Attempting to connect to: ${url}...`);
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth Connection Failed:', authError.message);
    } else {
      console.log('✅ Auth Connection Successful!');
    }

    const { data, error } = await supabase.from('dynamic_prices').select('product_id').limit(1);
    
    if (error) {
      console.error('❌ Database Connection/Permissions Failed:', error.message);
      if (error.code === 'PGRST301') {
         console.warn('   Note: This usually means Row Level Security (RLS) is blocking the read, or the table does not exist.');
      }
    } else {
      console.log('✅ Database Query Successful! Found data:', data);
    }
  } catch (e) {
    console.error('❌ Unexpected Error during connection:', e);
  }
}

testConnection();
