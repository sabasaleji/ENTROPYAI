require('dotenv').config(); // IMPORTANT: Load .env first!

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Debug output
console.log('=== Supabase Configuration ===');
console.log('SUPABASE_URL:', supabaseUrl || 'MISSING');
console.log('SUPABASE_KEY:', supabaseKey ? 'EXISTS' : 'MISSING');
console.log('==============================');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL or SUPABASE_KEY not found in .env file!');
  console.error('Make sure your .env file exists in:', __dirname);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;