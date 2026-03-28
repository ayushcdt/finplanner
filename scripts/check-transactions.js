const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function check() {
  console.log('Checking transactions...');

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('id, description, amount, notes, date')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\nTransactions:');
  transactions.forEach(t => {
    console.log(`- ${t.description || 'No desc'} | ${t.amount} | ${t.date} | notes: ${t.notes || 'none'}`);
  });

  const { data: accounts } = await supabase.from('accounts').select('name, balance');
  console.log('\nAccounts:');
  accounts.forEach(a => console.log(`- ${a.name}: ${a.balance}`));
}

check().catch(console.error);
