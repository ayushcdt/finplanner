const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function bulkAdd() {
  const { data: account } = await supabase.from('accounts').select('*').single();
  let balance = account.balance;
  console.log('Starting balance: ₹' + balance + '\n');

  // Get categories
  const { data: categories } = await supabase.from('categories').select('*');
  const getCat = (name) => categories.find(c => c.name === name);

  const utilities = getCat('Utilities');
  const transport = getCat('Transport');
  const groceries = getCat('Groceries');
  const onlineOrders = getCat('Online Orders');
  const cigarette = getCat('Cigarette');

  // Create Laundry category
  const { data: laundryCat } = await supabase.from('categories').insert({
    name: 'Laundry',
    icon: '👔',
    color: '#0891b2', // Cyan
    type: 'EXPENSE',
    group_name: 'Services',
    is_system: false,
    is_active: true,
    sort_order: 19
  }).select().single();
  console.log('✓ Created Laundry category');

  // 1. Mark TVS Jupiter EMI as PAID
  const { data: tvsEmi } = await supabase.from('transactions')
    .select('*').ilike('description', '%TVS Jupiter%').single();

  await supabase.from('transactions')
    .update({ notes: 'Vehicle Loan • PAID' })
    .eq('id', tvsEmi.id);
  balance -= tvsEmi.amount;
  console.log('✓ TVS Jupiter EMI PAID: -₹' + tvsEmi.amount);

  // 2. Livpure RO rent - ₹849 - 28/03/2026
  await supabase.from('transactions').insert({
    amount: 849, type: 'EXPENSE', category_id: utilities.id, account_id: account.id,
    description: 'Livpure RO Rent', date: '2026-03-28', notes: 'Monthly Rental • PAID'
  });
  balance -= 849;
  console.log('✓ Livpure RO Rent: -₹849');

  // 3. Coffee Vishakha - ₹312 - 25/03/2026
  await supabase.from('transactions').insert({
    amount: 312, type: 'EXPENSE', category_id: onlineOrders.id, account_id: account.id,
    description: 'Coffee - Vishakha Office', date: '2026-03-25', notes: 'Office Order • PAID'
  });
  balance -= 312;
  console.log('✓ Coffee Vishakha: -₹312');

  // 4. Cherry Food & Toy - ₹414 - 25/03/2026
  await supabase.from('transactions').insert({
    amount: 414, type: 'EXPENSE', category_id: onlineOrders.id, account_id: account.id,
    description: 'Cherry Food & Toy', date: '2026-03-25', notes: 'Pet Supplies • PAID'
  });
  balance -= 414;
  console.log('✓ Cherry Food & Toy: -₹414');

  // 5. Paneer - ₹220 - 25/03/2026
  await supabase.from('transactions').insert({
    amount: 220, type: 'EXPENSE', category_id: groceries.id, account_id: account.id,
    description: 'Paneer', date: '2026-03-25', notes: 'Groceries • PAID'
  });
  balance -= 220;
  console.log('✓ Paneer: -₹220');

  // 6. Petrol - ₹250 - 26/03/2026
  await supabase.from('transactions').insert({
    amount: 250, type: 'EXPENSE', category_id: transport.id, account_id: account.id,
    description: 'Petrol', date: '2026-03-26', notes: 'Fuel • PAID'
  });
  balance -= 250;
  console.log('✓ Petrol: -₹250');

  // 7. Rapido - ₹62 - 26/03/2026
  await supabase.from('transactions').insert({
    amount: 62, type: 'EXPENSE', category_id: transport.id, account_id: account.id,
    description: 'Rapido', date: '2026-03-26', notes: 'Bike Taxi • PAID'
  });
  balance -= 62;
  console.log('✓ Rapido: -₹62');

  // 8. Airtel Recharge - ₹199 - 26/03/2026
  await supabase.from('transactions').insert({
    amount: 199, type: 'EXPENSE', category_id: utilities.id, account_id: account.id,
    description: 'Airtel Recharge', date: '2026-03-26', notes: 'Mobile Recharge • PAID'
  });
  balance -= 199;
  console.log('✓ Airtel Recharge: -₹199');

  // 9. Local Ticket - ₹100 - 26/03/2026
  await supabase.from('transactions').insert({
    amount: 100, type: 'EXPENSE', category_id: transport.id, account_id: account.id,
    description: 'Local Ticket', date: '2026-03-26', notes: 'Train/Bus • PAID'
  });
  balance -= 100;
  console.log('✓ Local Ticket: -₹100');

  // 10. Update Star Bazar to ₹2090.44
  const { data: starBazar } = await supabase.from('transactions')
    .select('*').eq('description', 'Star Bazar').single();
  const starDiff = 2090.44 - starBazar.amount;
  await supabase.from('transactions').update({ amount: 2090.44 }).eq('id', starBazar.id);
  balance -= starDiff;
  console.log('✓ Star Bazar updated: ₹2090 → ₹2090.44');

  // 11. Cigarette - ₹50 - 26/03/2026 (first)
  await supabase.from('transactions').insert({
    amount: 50, type: 'EXPENSE', category_id: cigarette.id, account_id: account.id,
    description: 'Cigarette', date: '2026-03-26', notes: 'PAID'
  });
  balance -= 50;
  console.log('✓ Cigarette: -₹50');

  // 12. Laundry - ₹2625 - 26/03/2026
  await supabase.from('transactions').insert({
    amount: 2625, type: 'EXPENSE', category_id: laundryCat.id, account_id: account.id,
    description: 'Laundry', date: '2026-03-26', notes: 'Clothes Washing • PAID'
  });
  balance -= 2625;
  console.log('✓ Laundry: -₹2625');

  // 13. Vehicle Cleaner - ₹700 - 26/03/2026
  await supabase.from('transactions').insert({
    amount: 700, type: 'EXPENSE', category_id: transport.id, account_id: account.id,
    description: 'Vehicle Cleaner', date: '2026-03-26', notes: 'Bike/Car Wash • PAID'
  });
  balance -= 700;
  console.log('✓ Vehicle Cleaner: -₹700');

  // 14. CP Fishland - ₹1120 - 26/03/2026
  await supabase.from('transactions').insert({
    amount: 1120, type: 'EXPENSE', category_id: onlineOrders.id, account_id: account.id,
    description: 'CP Fishland', date: '2026-03-26', notes: 'Pet Supplies • PAID'
  });
  balance -= 1120;
  console.log('✓ CP Fishland: -₹1120');

  // 15. Update existing ₹550 online order to CP Fishland
  await supabase.from('transactions')
    .update({ description: 'CP Fishland', notes: 'Pet Supplies • PAID' })
    .eq('description', 'Online Order').eq('amount', 550);
  console.log('✓ Updated ₹550 order → CP Fishland');

  // 16. Cigarette - ₹50 - 26/03/2026 (second)
  await supabase.from('transactions').insert({
    amount: 50, type: 'EXPENSE', category_id: cigarette.id, account_id: account.id,
    description: 'Cigarette', date: '2026-03-26', notes: 'PAID'
  });
  balance -= 50;
  console.log('✓ Cigarette: -₹50');

  // 17. Rapido - ₹55 - 27/03/2026
  await supabase.from('transactions').insert({
    amount: 55, type: 'EXPENSE', category_id: transport.id, account_id: account.id,
    description: 'Rapido', date: '2026-03-27', notes: 'Bike Taxi • PAID'
  });
  balance -= 55;
  console.log('✓ Rapido: -₹55');

  // 18. Vishakha Office Order - ₹262 - 27/03/2026
  await supabase.from('transactions').insert({
    amount: 262, type: 'EXPENSE', category_id: onlineOrders.id, account_id: account.id,
    description: 'Vishakha Office Order', date: '2026-03-27', notes: 'Office Order • PAID'
  });
  balance -= 262;
  console.log('✓ Vishakha Office Order: -₹262');

  // 19. Local Ticket - ₹100 - 27/03/2026
  await supabase.from('transactions').insert({
    amount: 100, type: 'EXPENSE', category_id: transport.id, account_id: account.id,
    description: 'Local Ticket', date: '2026-03-27', notes: 'Train/Bus • PAID'
  });
  balance -= 100;
  console.log('✓ Local Ticket: -₹100');

  // 20. Cigarette - ₹50 - 27/03/2026
  await supabase.from('transactions').insert({
    amount: 50, type: 'EXPENSE', category_id: cigarette.id, account_id: account.id,
    description: 'Cigarette', date: '2026-03-27', notes: 'PAID'
  });
  balance -= 50;
  console.log('✓ Cigarette: -₹50');

  // Update final balance
  await supabase.from('accounts').update({ balance }).eq('id', account.id);
  console.log('\n✅ Final balance: ₹' + balance.toFixed(2));
}

bulkAdd().catch(console.error);
