const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function fix() {
  // Update Credit Card with unique icon and color
  // Using cyan #06b6d4 - not used by any other category
  const { error } = await supabase
    .from('categories')
    .update({
      icon: '🧾',
      color: '#06b6d4'  // Cyan - unique
    })
    .eq('name', 'Credit Card');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Credit Card updated: 🧾 | #06b6d4 (cyan)');

  // Show final state
  const { data: categories } = await supabase
    .from('categories')
    .select('name, icon, color')
    .eq('type', 'EXPENSE')
    .order('sort_order');

  console.log('\nAll expense categories:');
  categories.forEach(c => console.log(`${c.icon} ${c.name} - ${c.color}`));
}

fix().catch(console.error);
