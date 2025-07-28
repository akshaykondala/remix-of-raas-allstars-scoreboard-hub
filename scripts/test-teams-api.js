// Test script to verify teams API integration
// Run with: node scripts/test-teams-api.js

const API_URL = process.env.VITE_DIRECTUS_URL || 'https://your-directus-instance.com';
const TOKEN = process.env.VITE_DIRECTUS_TOKEN || 'your-directus-token';

async function testTeamsAPI() {
  console.log('Testing Teams API Integration...\n');
  
  try {
    // Test basic API connection
    console.log('1. Testing API connection...');
    const response = await fetch(`${API_URL}/items/teams`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API connection successful');
    console.log(`📊 Found ${data.data?.length || 0} teams in database\n`);

    // Test team data structure
    if (data.data && data.data.length > 0) {
      console.log('2. Testing team data structure...');
      const firstTeam = data.data[0];
      
      const requiredFields = ['id', 'name', 'university', 'bid_points', 'qualified', 'color'];
      const missingFields = requiredFields.filter(field => !(field in firstTeam));
      
      if (missingFields.length === 0) {
        console.log('✅ All required fields present');
        console.log('📋 Sample team data:');
        console.log(JSON.stringify(firstTeam, null, 2));
      } else {
        console.log('❌ Missing required fields:', missingFields);
      }
    } else {
      console.log('⚠️  No teams found in database');
      console.log('💡 Add some teams to your Directus teams collection');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your VITE_DIRECTUS_URL and VITE_DIRECTUS_TOKEN environment variables');
    console.log('2. Verify your Directus instance is running');
    console.log('3. Ensure you have a "teams" collection in Directus');
    console.log('4. Check that your API token has read permissions for the teams collection');
  }
}

// Run the test
testTeamsAPI(); 