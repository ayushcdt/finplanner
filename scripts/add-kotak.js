const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function addKotak() {
  // Get account
  const { data: account } = await supabase.from('accounts').select('*').single();
  console.log('Current balance: ₹' + account.balance);

  // Get Credit Card category
  const { data: categories } = await supabase.from('categories').select('*');
  const creditCard = categories.find(c => c.name === 'Credit Card');

  // Add Kotak Credit Card transaction
  await supabase.from('transactions').insert({
    amount: 10000,
    type: 'EXPENSE',
    category_id: creditCard.id,
    account_id: account.id,
    description: 'Kotak Credit Card',
    date: '2026-03-28',
    notes: 'Credit Card Payment • PAID'
  });

  // Update balance
  const newBalance = account.balance - 10000;
  await supabase.from('accounts').update({ balance: newBalance }).eq('id', account.id);

  console.log('✓ Kotak Credit Card: -₹10,000');
  console.log('New balance: ₹' + newBalance.toFixed(2));
}

addKotak().catch(console.error);
