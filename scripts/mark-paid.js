const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function markPaid() {
  // Find AC EMI transaction
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .ilike('description', '%AC EMI%');

  if (!transactions || transactions.length === 0) {
    console.log('AC EMI transaction not found');
    return;
  }

  const tx = transactions[0];
  console.log('Found:', tx.description, '| Amount:', tx.amount);

  // Update notes to remove PENDING
  const newNotes = tx.notes.replace(' • PENDING', '').replace('PENDING', '');

  const { error: updateError } = await supabase
    .from('transactions')
    .update({ notes: newNotes + ' • PAID' })
    .eq('id', tx.id);

  if (updateError) {
    console.error('Error updating transaction:', updateError);
    return;
  }
  console.log('Updated notes to:', newNotes + ' • PAID');

  // Deduct from account balance
  const { data: account } = await supabase
    .from('accounts')
    .select('*')
    .single();

  const newBalance = account.balance - tx.amount;

  const { error: balanceError } = await supabase
    .from('accounts')
    .update({ balance: newBalance })
    .eq('id', account.id);

  if (balanceError) {
    console.error('Error updating balance:', balanceError);
    return;
  }

  console.log('Balance updated: ₹' + account.balance + ' → ₹' + newBalance);
  console.log('\nDone! AC EMI marked as paid.');
}

markPaid().catch(console.error);
