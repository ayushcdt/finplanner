const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
);

async function fix() {
  // Calculate correct balance from scratch
  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, type, notes, description');

  let income = 0;
  let expenses = 0;
  let pending = 0;

  console.log('Recalculating from transactions:\n');

  transactions.forEach(t => {
    const isPending = t.notes?.toUpperCase().includes('PENDING');

    if (t.type === 'INCOME') {
      income += t.amount;
      console.log(`+ ₹${t.amount} | ${t.description}`);
    } else {
      if (isPending) {
        pending += t.amount;
        console.log(`⏳ ₹${t.amount} | ${t.description} (PENDING - not deducted)`);
      } else {
        expenses += t.amount;
        console.log(`- ₹${t.amount} | ${t.description}`);
      }
    }
  });

  const correctBalance = income - expenses;

  console.log('\n--- SUMMARY ---');
  console.log('Income:', income);
  console.log('Expenses (paid):', expenses);
  console.log('Pending:', pending);
  console.log('Correct Balance:', correctBalance);

  // Update account balance
  const { data: account } = await supabase.from('accounts').select('*').single();
  console.log('\nCurrent DB balance:', account.balance);
  console.log('Updating to:', correctBalance);

  await supabase.from('accounts').update({ balance: correctBalance }).eq('id', account.id);
  console.log('✓ Balance corrected to ₹' + correctBalance);
}

fix().catch(console.error);
