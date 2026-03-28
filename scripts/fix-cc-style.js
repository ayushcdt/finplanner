const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function fix() {
  // Get all categories to see current icons/colors
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('type', 'EXPENSE');

  console.log('Current categories:');
  categories.forEach(c => console.log(`- ${c.name}: ${c.icon} | ${c.color}`));

  // Update Credit Card to be distinct - use receipt/bill icon and different color
  const { error } = await supabase
    .from('categories')
    .update({
      icon: '🧾',  // Receipt icon - represents bills
      color: '#f97316'  // Orange - distinct from purple EMI
    })
    .eq('name', 'Credit Card');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('\nUpdated Credit Card: 🧾 | #f97316 (orange)');
}

fix().catch(console.error);
