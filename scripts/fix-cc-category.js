const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function fixCategory() {
  // Create Credit Card Bills category
  const { data: newCategory, error: catError } = await supabase
    .from('categories')
    .insert({
      name: 'Credit Card',
      icon: '💳',
      color: '#8b5cf6',
      type: 'EXPENSE',
      group_name: 'Bills',
      is_system: false,
      is_active: true,
      sort_order: 15
    })
    .select()
    .single();

  if (catError) {
    console.error('Error creating category:', catError);
    return;
  }
  console.log('Created category: Credit Card 💳');

  // Find and update the Axis CC transaction
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .ilike('description', '%Axis Credit Card%');

  if (!transactions || transactions.length === 0) {
    console.log('Transaction not found');
    return;
  }

  const tx = transactions[0];

  const { error: updateError } = await supabase
    .from('transactions')
    .update({ category_id: newCategory.id })
    .eq('id', tx.id);

  if (updateError) {
    console.error('Error updating transaction:', updateError);
    return;
  }

  console.log('Updated transaction category: EMI → Credit Card');
  console.log('\nDone!');
}

fixCategory().catch(console.error);
