const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function addCCPayment() {
  // Get categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('type', 'EXPENSE');

  console.log('Categories:', categories.map(c => c.name).join(', '));

  // Find EMI category (credit card payments often go here) or Bills
  let category = categories.find(c => c.name.toLowerCase().includes('emi') || c.name.toLowerCase().includes('credit'));
  if (!category) {
    category = categories.find(c => c.name.toLowerCase().includes('bill'));
  }
  if (!category) {
    category = categories[0]; // fallback
  }
  console.log('Using category:', category.name);

  // Get account
  const { data: account } = await supabase
    .from('accounts')
    .select('*')
    .single();

  console.log('Account:', account.name, '| Balance:', account.balance);

  // Add transaction
  const { data: tx, error: txError } = await supabase
    .from('transactions')
    .insert({
      amount: 13000,
      type: 'EXPENSE',
      category_id: category.id,
      account_id: account.id,
      description: 'Axis Credit Card Payment',
      date: '2026-03-25',
      notes: 'Credit Card Bill • PAID'
    })
    .select()
    .single();

  if (txError) {
    console.error('Error adding transaction:', txError);
    return;
  }
  console.log('Added transaction:', tx.description, '| ₹' + tx.amount);

  // Update balance
  const newBalance = account.balance - 13000;
  await supabase
    .from('accounts')
    .update({ balance: newBalance })
    .eq('id', account.id);

  console.log('Balance updated: ₹' + account.balance + ' → ₹' + newBalance);
  console.log('\nDone!');
}

addCCPayment().catch(console.error);
