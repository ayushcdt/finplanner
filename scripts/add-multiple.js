const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function add() {
  // Get account
  const { data: account } = await supabase.from('accounts').select('*').single();
  let balance = account.balance;
  console.log('Starting balance: ₹' + balance);

  // Get existing categories
  const { data: categories } = await supabase.from('categories').select('*');
  const utilities = categories.find(c => c.name === 'Utilities');
  const groceries = categories.find(c => c.name === 'Groceries');

  // 1. Create Cigarette category
  const { data: cigaretteCat } = await supabase
    .from('categories')
    .insert({
      name: 'Cigarette',
      icon: '🚬',
      color: '#71717a', // Gray/zinc
      type: 'EXPENSE',
      group_name: 'Lifestyle',
      is_system: false,
      is_active: true,
      sort_order: 18
    })
    .select()
    .single();
  console.log('✓ Created Cigarette category');

  // 2. Add Airtel Recharge - ₹349 on 24/03/2026
  await supabase.from('transactions').insert({
    amount: 349,
    type: 'EXPENSE',
    category_id: utilities.id,
    account_id: account.id,
    description: 'Airtel Recharge',
    date: '2026-03-24',
    notes: 'Mobile Recharge • PAID'
  });
  balance -= 349;
  console.log('✓ Airtel Recharge: -₹349');

  // 3. Add Banana - ₹29 on 24/03/2026
  await supabase.from('transactions').insert({
    amount: 29,
    type: 'EXPENSE',
    category_id: groceries.id,
    account_id: account.id,
    description: 'Banana',
    date: '2026-03-24',
    notes: 'Zepto • PAID'
  });
  balance -= 29;
  console.log('✓ Banana: -₹29');

  // 4. Add Cigarette - ₹240 on 24/03/2026
  await supabase.from('transactions').insert({
    amount: 240,
    type: 'EXPENSE',
    category_id: cigaretteCat.id,
    account_id: account.id,
    description: 'Cigarette',
    date: '2026-03-24',
    notes: 'Zepto • PAID'
  });
  balance -= 240;
  console.log('✓ Cigarette: -₹240');

  // Update balance
  await supabase.from('accounts').update({ balance }).eq('id', account.id);
  console.log('\nNew balance: ₹' + balance);
}

add().catch(console.error);
