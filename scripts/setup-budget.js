const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function setup() {
  // 1. Create "Online Orders" category
  const { data: newCat, error: catErr } = await supabase
    .from('categories')
    .insert({
      name: 'Online Orders',
      icon: '📦',
      color: '#0ea5e9', // Sky blue - unique
      type: 'EXPENSE',
      group_name: 'Shopping',
      is_system: false,
      is_active: true,
      sort_order: 16
    })
    .select()
    .single();

  if (catErr && !catErr.message.includes('duplicate')) {
    console.error('Error creating category:', catErr);
  } else {
    console.log('✓ Created "Online Orders" category');
  }

  // 2. Get all relevant categories for weekly budget
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .in('name', ['Groceries', 'Transport', 'Online Orders']);

  // Check for Household category or create it
  let { data: householdCat } = await supabase
    .from('categories')
    .select('*')
    .eq('name', 'Household')
    .single();

  if (!householdCat) {
    const { data: newHousehold } = await supabase
      .from('categories')
      .insert({
        name: 'Household',
        icon: '🏡',
        color: '#a855f7', // Purple
        type: 'EXPENSE',
        group_name: 'Home',
        is_system: false,
        is_active: true,
        sort_order: 17
      })
      .select()
      .single();
    householdCat = newHousehold;
    console.log('✓ Created "Household" category');
  }

  // Get Online Orders category
  const { data: onlineOrdersCat } = await supabase
    .from('categories')
    .select('*')
    .eq('name', 'Online Orders')
    .single();

  console.log('\n📋 Weekly Budget Categories (₹5,000/week = ₹20,000/month):');
  console.log('- Groceries');
  console.log('- Transport (Travel)');
  console.log('- Household');
  console.log('- Online Orders');

  // 3. Show all categories
  const { data: allCats } = await supabase
    .from('categories')
    .select('name, icon, color')
    .eq('type', 'EXPENSE')
    .eq('is_active', true)
    .order('sort_order');

  console.log('\n📂 All Expense Categories:');
  allCats.forEach(c => console.log(`${c.icon} ${c.name}`));
}

setup().catch(console.error);
