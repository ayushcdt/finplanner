const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function fix() {
  // Fix Star Bazar notes - avoid "pending" word triggering due detection
  await supabase
    .from('transactions')
    .update({ notes: 'Groceries + Household (awaiting split) • PAID' })
    .eq('description', 'Star Bazar');

  console.log('✓ Fixed Star Bazar notes');

  // Show remaining due
  const { data: pending } = await supabase
    .from('transactions')
    .select('description, amount')
    .or('notes.ilike.%PENDING%,notes.ilike.%DUE%');

  console.log('\nRemaining Due:');
  pending.forEach(t => console.log(`- ${t.description}: ₹${t.amount}`));
}

fix().catch(console.error);
