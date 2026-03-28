const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function addSwiggy() {
  const { data: account } = await supabase.from('accounts').select('*').single();
  console.log('Current balance: ₹' + account.balance);

  const { data: categories } = await supabase.from('categories').select('*');
  const onlineOrders = categories.find(c => c.name === 'Online Orders');

  await supabase.from('transactions').insert({
    amount: 268,
    type: 'EXPENSE',
    category_id: onlineOrders.id,
    account_id: account.id,
    description: 'Swiggy Order',
    date: '2026-03-28',
    notes: 'Food Delivery • PAID'
  });

  const newBalance = account.balance - 268;
  await supabase.from('accounts').update({ balance: newBalance }).eq('id', account.id);

  console.log('✓ Swiggy Order: -₹268');
  console.log('New balance: ₹' + newBalance.toFixed(2));
}

addSwiggy().catch(console.error);
