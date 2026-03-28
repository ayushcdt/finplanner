const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function update() {
  // Find Jigisha gift transaction
  const { data: tx } = await supabase
    .from('transactions')
    .select('*')
    .ilike('description', '%Jigisha%')
    .single();

  const oldAmount = tx.amount;
  const newAmount = 2197;
  const diff = newAmount - oldAmount;

  console.log('Gift - Jigisha: ₹' + oldAmount + ' → ₹' + newAmount);

  // Update transaction
  await supabase
    .from('transactions')
    .update({ amount: newAmount })
    .eq('id', tx.id);

  // Update balance
  const { data: account } = await supabase.from('accounts').select('*').single();
  const newBalance = account.balance - diff;

  await supabase.from('accounts').update({ balance: newBalance }).eq('id', account.id);

  console.log('Balance: ₹' + account.balance + ' → ₹' + newBalance);
}

update().catch(console.error);
