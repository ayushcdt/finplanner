const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function update() {
  const { data: account } = await supabase.from('accounts').select('*').single();
  let balance = account.balance;
  console.log('Starting balance: ₹' + balance);

  const { data: categories } = await supabase.from('categories').select('*');
  const utilities = categories.find(c => c.name === 'Utilities');
  const shopping = categories.find(c => c.name === 'Shopping');
  const groceries = categories.find(c => c.name === 'Groceries');

  // 1. Mark WiFi as paid
  const { data: wifiTx } = await supabase
    .from('transactions')
    .select('*')
    .eq('description', 'WiFi')
    .single();

  if (wifiTx) {
    const newNotes = wifiTx.notes.replace(' • PENDING', '').replace('PENDING', '') + ' • PAID';
    await supabase.from('transactions').update({ notes: newNotes }).eq('id', wifiTx.id);
    balance -= wifiTx.amount;
    console.log('✓ WiFi marked PAID: -₹' + wifiTx.amount);
  }

  // 2. Electricity bill ₹2,126
  await supabase.from('transactions').insert({
    amount: 2126,
    type: 'EXPENSE',
    category_id: utilities.id,
    account_id: account.id,
    description: 'Electricity Bill',
    date: '2026-03-28',
    notes: 'Monthly Electricity • PAID'
  });
  balance -= 2126;
  console.log('✓ Electricity Bill: -₹2,126');

  // 3. Gift for Jigisha ₹2,100
  await supabase.from('transactions').insert({
    amount: 2100,
    type: 'EXPENSE',
    category_id: shopping.id,
    account_id: account.id,
    description: 'Gift - Jigisha',
    date: '2026-03-28',
    notes: 'Friend Gift • PAID'
  });
  balance -= 2100;
  console.log('✓ Gift (Jigisha): -₹2,100');

  // 4. Star Bazar ₹2,090 (groceries + household - split pending)
  await supabase.from('transactions').insert({
    amount: 2090,
    type: 'EXPENSE',
    category_id: groceries.id,
    account_id: account.id,
    description: 'Star Bazar',
    date: '2026-03-28',
    notes: 'Groceries + Household (split pending) • PAID'
  });
  balance -= 2090;
  console.log('✓ Star Bazar: -₹2,090 (split pending)');

  // Update balance
  await supabase.from('accounts').update({ balance }).eq('id', account.id);
  console.log('\nNew balance: ₹' + balance);

  // Summary
  const { data: pending } = await supabase
    .from('transactions')
    .select('description, amount')
    .ilike('notes', '%PENDING%');

  console.log('\nRemaining Due:');
  if (pending.length === 0) {
    console.log('None');
  } else {
    pending.forEach(t => console.log(`- ${t.description}: ₹${t.amount}`));
  }
}

update().catch(console.error);
