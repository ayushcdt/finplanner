const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

const WEEKLY_BUDGET_CATEGORIES = ['Groceries', 'Transport', 'Household', 'Online Orders'];

async function check() {
  const { data: transactions } = await supabase
    .from('transactions')
    .select('description, amount, category:categories(name)')
    .eq('type', 'EXPENSE');

  console.log('All Expense Transactions:\n');

  let weeklyBudgetTotal = 0;
  let otherTotal = 0;

  transactions.forEach(t => {
    const catName = t.category?.name || 'Unknown';
    const isWeeklyBudget = WEEKLY_BUDGET_CATEGORIES.includes(catName);

    if (isWeeklyBudget) {
      weeklyBudgetTotal += t.amount;
      console.log(`✓ ${t.description} | ₹${t.amount} | ${catName} (Weekly Budget)`);
    } else {
      otherTotal += t.amount;
      console.log(`  ${t.description} | ₹${t.amount} | ${catName}`);
    }
  });

  console.log('\n--- SUMMARY ---');
  console.log('Weekly Budget Categories Spent:', weeklyBudgetTotal);
  console.log('Other Categories Spent:', otherTotal);
  console.log('Weekly Budget Remaining:', (5000 * 4) - weeklyBudgetTotal);
}

check().catch(console.error);
