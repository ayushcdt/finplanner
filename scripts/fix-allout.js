const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function fix() {
  // Get Household category
  const { data: household } = await supabase
    .from('categories')
    .select('*')
    .eq('name', 'Household')
    .single();

  if (!household) {
    console.error('Household category not found');
    return;
  }

  // Update Allout to Household
  const { error } = await supabase
    .from('transactions')
    .update({ category_id: household.id })
    .ilike('description', '%Allout%');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('✓ Allout moved to Household category');

  // Check result
  const { data: transactions } = await supabase
    .from('transactions')
    .select('description, amount, category:categories(name)')
    .in('category_id', [household.id]);

  console.log('\nHousehold items:');
  transactions.forEach(t => console.log(`- ${t.description}: ₹${t.amount}`));
}

fix().catch(console.error);
