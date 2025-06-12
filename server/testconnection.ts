import { supabase } from './database';

async function testConnection() {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('❌ Supabase error:', error.message);
  } else {
    console.log('✅ Users:', data);
  }
}

testConnection();
