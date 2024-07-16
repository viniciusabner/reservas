const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dqnynbanpnqdgxycpazs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbnluYmFucG5xZGd4eWNwYXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA1NzkxMTksImV4cCI6MjAzNjE1NTExOX0.vM6ku9gHmz299UsXeEdzWopUxYJWabCIvtNU3e8npFs';
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase; 
