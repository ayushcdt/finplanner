// Fix category icons in Supabase
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://tfgcjhthwbronycbpmrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2NqaHRod2Jyb255Y2JwbXJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MjE5NjIsImV4cCI6MjA5MDA5Nzk2Mn0.MPEwEG1BtO6o2A8IPkLZr1jwESQVydKsFNcnpijs6gQ'
)

const iconMap = {
  'Rent / EMI': '🏠',
  'Groceries': '🛒',
  'Utilities': '💡',
  'Transport': '🚗',
  'Insurance': '🛡️',
  'Mobile & Internet': '📱',
  'Dining Out': '🍽️',
  'Entertainment': '🎬',
  'Shopping': '🛍️',
  'Subscriptions': '📺',
  'Travel': '✈️',
  'Hobbies': '🎮',
  'Investments': '📈',
  'Savings': '🏦',
  'Debt Payment': '💳',
  'Health & Medical': '🏥',
  'Education': '📚',
  'Personal Care': '💇',
  'Gifts & Donations': '🎁',
  'Other Expenses': '📦',
  'Salary': '💼',
  'Freelance': '💻',
  'Business': '🏢',
  'Rental Income': '🏠',
  'Interest': '🏦',
  'Other Income': '💵',
}

async function fixIcons() {
  for (const [name, icon] of Object.entries(iconMap)) {
    const { error } = await supabase
      .from('categories')
      .update({ icon })
      .eq('name', name)

    if (error) {
      console.error(`Error updating ${name}:`, error.message)
    } else {
      console.log(`Updated ${name} -> ${icon}`)
    }
  }
  console.log('Done!')
}

fixIcons()
