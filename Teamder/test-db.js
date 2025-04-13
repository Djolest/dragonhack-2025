// test-db.js
// Run with: node test-db.js
require('dotenv').config(); // Load environment variables from .env file

// Import the functions from your server file
const {
    login,
    register,
    updatePers,
    getTeams,
    createTeam,
    getMembers,
    invite,
    makeMember,
    getPers
} = require('./app/lib/db/appwrite.js');

// Test user data
const testUsers = {
    alice: {
        name: 'Alice Johnson',
        email: 'alice.test@example.com',
        password: 'securePassword123!',
        personality: JSON.stringify({
            openness: 0.8,
            conscientiousness: 0.7,
            extraversion: 0.6,
            agreeableness: 0.9,
            neuroticism: 0.3
        })
    },
    bob: {
        name: 'Bob Smith',
        email: 'bob.test@example.com',
        password: 'bobSecurePass456!',
        personality: JSON.stringify({
            openness: 0.5,
            conscientiousness: 0.8,
            extraversion: 0.4,
            agreeableness: 0.6,
            neuroticism: 0.5
        })
    }
};

// Test team data
const testTeam = {
    name: 'Test Team Alpha'
};

// Utility to log test results
function logResult(testName, result) {
    console.log(`\n--- ${testName} ---`);
    console.log(JSON.stringify(result, null, 2));
    console.log('-'.repeat(40));
    return result;
}

// Main test function
async function runTests() {
    console.log('Starting database functionality tests...\n');
    
    try {
        // Step 1: Register test users
        console.log('1. Registering test users...');
        const aliceRegistration = await register(testUsers.alice.name, testUsers.alice.email, testUsers.alice.password);
        logResult('Register Alice', aliceRegistration);
        
        const bobRegistration = await register(testUsers.bob.name, testUsers.bob.email, testUsers.bob.password);
        logResult('Register Bob', bobRegistration);
        
        // Store user IDs
        const aliceId = aliceRegistration.uid;
        const bobId = bobRegistration.uid;
        
        if (!aliceId || !bobId) {
            throw new Error('Failed to register test users');
        }
        
        // Step 2: Test login
        console.log('2. Testing login functionality...');
        const aliceLogin = await login(testUsers.alice.email, testUsers.alice.password);
        logResult('Login Alice', aliceLogin);
        
        // Step 3: Update personalities
        console.log('3. Updating user personalities...');
        const updateAlicePers = await updatePers(testUsers.alice.personality, aliceId);
        logResult('Update Alice Personality', updateAlicePers);
        
        const updateBobPers = await updatePers(testUsers.bob.personality, bobId);
        logResult('Update Bob Personality', updateBobPers);
        
        // Step 4: Create a team
        console.log('4. Creating a test team...');
        const teamCreation = await createTeam(testTeam.name, aliceId);
        logResult('Create Team', teamCreation);
        
        const teamId = teamCreation.tid;
        
        if (!teamId) {
            throw new Error('Failed to create test team');
        }
        
        // Step 5: Get teams for Alice
        console.log('5. Getting teams for Alice...');
        const aliceTeams = await getTeams(aliceId);
        logResult('Get Alice Teams', aliceTeams);
        
        // Step 6: Invite Bob to the team
        console.log('6. Inviting Bob to the team...');
        const inviteBob = await invite(testUsers.bob.email, teamId, aliceId);
        logResult('Invite Bob', inviteBob);
        
        // Step 7: Get team members
        console.log('7. Getting team members...');
        const teamMembers = await getMembers(teamId);
        logResult('Get Team Members', teamMembers);
        
        // Step 8: Approve Bob as a team member
        console.log('8. Approving Bob as a team member...');
        const approveBob = await makeMember(teamId, bobId, aliceId);
        logResult('Approve Bob', approveBob);
        
        // Step 9: Get updated team members
        console.log('9. Getting updated team members...');
        const updatedTeamMembers = await getMembers(teamId);
        logResult('Get Updated Team Members', updatedTeamMembers);
        
        // Step 10: Get Bob's personality
        console.log('10. Getting Bob\'s personality...');
        const bobPersonality = await getPers(bobId);
        logResult('Get Bob Personality', bobPersonality);
        
        // Step 11: Bob's teams (should now include the team)
        console.log('11. Getting Bob\'s teams...');
        const bobTeams = await getTeams(bobId);
        logResult('Get Bob Teams', bobTeams);
        
        console.log('\nAll tests completed successfully!');
        
    } catch (error) {
        console.error('\nTest failed:', error);
    }
}

// Run the tests
runTests();