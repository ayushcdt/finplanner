const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function add() {
  // Get Online Orders category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('name', 'Online Orders')
    .single();

  // Get account
  const { data: account } = await supabase
    .from('accounts')
    .select('*')
    .single();

  // Add transaction
  const { data: tx, error } = await supabase
    .from('transactions')
    .insert({
      amount: 550,
      type: 'EXPENSE',
      category_id: category.id,
      account_id: account.id,
      description: 'Online Order',
      date: '2026-03-24',
      notes: 'PAID'
    })
    .select()
    .single();

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Update balance
  const newBalance = account.balance - 550;
  await supabase.from('accounts').update({ balance: newBalance }).eq('id', account.id);

  console.log('✓ Added: Online Order | ₹550 | 24/03/2026');
  console.log('Balance: ₹' + account.balance + ' → ₹' + newBalance);
}

add().catch(console.error);
