const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function check() {
  const { data: transactions } = await supabase
    .from('transactions')
    .select('description, amount, notes')
    .order('date', { ascending: false });

  console.log('All transactions:');
  transactions.forEach(t => {
    console.log(`${t.description} | ₹${t.amount} | "${t.notes}"`);
  });
}

check().catch(console.error);
