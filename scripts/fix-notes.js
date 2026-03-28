const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function fix() {
  // Fix Rent notes - remove "Due by" text
  await supabase
    .from('transactions')
    .update({ notes: 'Monthly Rent • PAID' })
    .eq('description', 'Rent');
  console.log('✓ Fixed Rent notes');

  // Fix WiFi notes
  await supabase
    .from('transactions')
    .update({ notes: 'Internet Bill • PAID' })
    .eq('description', 'WiFi');
  console.log('✓ Fixed WiFi notes');

  // Summary
  const { data: all } = await supabase
    .from('transactions')
    .select('description, amount, notes')
    .order('date', { ascending: false });

  console.log('\nAll transactions:');
  all.forEach(t => {
    const isPending = t.notes?.toUpperCase().includes('PENDING');
    const status = isPending ? '⏳ DUE' : '✓ PAID';
    console.log(`${status} | ${t.description} | ₹${t.amount}`);
  });

  // Only truly pending
  const pending = all.filter(t => t.notes?.toUpperCase().includes('PENDING'));
  console.log('\n📌 Actually pending:');
  let total = 0;
  pending.forEach(t => {
    console.log(`- ${t.description}: ₹${t.amount}`);
    total += t.amount;
  });
  console.log(`Total due: ₹${total}`);
}

fix().catch(console.error);
