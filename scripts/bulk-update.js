const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function bulkUpdate() {
  // Get account
  const { data: account } = await supabase.from('accounts').select('*').single();
  let balance = account.balance;
  console.log('Starting balance:', balance);

  // Get categories
  const { data: categories } = await supabase.from('categories').select('*');
  const incomeCategory = categories.find(c => c.type === 'INCOME');
  const creditCardCategory = categories.find(c => c.name === 'Credit Card');

  // 1. Add Income ₹108,000 on 24/03/2026
  const { data: incomeTx, error: incomeErr } = await supabase
    .from('transactions')
    .insert({
      amount: 108000,
      type: 'INCOME',
      category_id: incomeCategory.id,
      account_id: account.id,
      description: 'Salary',
      date: '2026-03-24',
      notes: 'Monthly Salary'
    })
    .select()
    .single();

  if (incomeErr) {
    console.error('Error adding income:', incomeErr);
  } else {
    balance += 108000;
    console.log('✓ Added Income: ₹108,000 on 24/03/2026');
  }

  // 2. Mark Rent as paid
  const { data: rentTx } = await supabase
    .from('transactions')
    .select('*')
    .eq('description', 'Rent')
    .single();

  if (rentTx) {
    const newNotes = rentTx.notes.replace(' • PENDING', '').replace('PENDING', '') + ' • PAID';
    await supabase
      .from('transactions')
      .update({ notes: newNotes })
      .eq('id', rentTx.id);

    balance -= rentTx.amount;
    console.log('✓ Rent marked as PAID: -₹' + rentTx.amount);
  }

  // 3. Add LazyPay repayment ₹3,862
  const { error: lazyPayErr } = await supabase
    .from('transactions')
    .insert({
      amount: 3862,
      type: 'EXPENSE',
      category_id: creditCardCategory.id,
      account_id: account.id,
      description: 'LazyPay Repayment',
      date: '2026-03-28',
      notes: 'BNPL Repayment • PAID'
    })
    .select()
    .single();

  if (lazyPayErr) {
    console.error('Error adding LazyPay:', lazyPayErr);
  } else {
    balance -= 3862;
    console.log('✓ Added LazyPay Repayment: -₹3,862');
  }

  // Update account balance
  await supabase
    .from('accounts')
    .update({ balance })
    .eq('id', account.id);

  console.log('\nFinal balance: ₹' + balance);

  // Show summary
  const { data: allTx } = await supabase
    .from('transactions')
    .select('description, amount, type, notes')
    .order('date', { ascending: false });

  console.log('\nAll transactions:');
  allTx.forEach(t => {
    const status = t.notes?.includes('PENDING') ? 'DUE' : 'PAID';
    const sign = t.type === 'INCOME' ? '+' : '-';
    console.log(`${sign}₹${t.amount} | ${t.description} | ${status}`);
  });
}

bulkUpdate().catch(console.error);
