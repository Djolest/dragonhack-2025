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
    acceptInvite,
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
        aliceId = null;
        await register(testUsers.alice.name, testUsers.alice.email, testUsers.alice.password, () => {}, (reg) => {aliceId = reg;});
        if (!aliceId) {
            console.log('Alice ID is undefined');
        } else {
            logResult('Register Alice', aliceId);
        }
        
        bobId = null;
        await register(testUsers.bob.name, testUsers.bob.email, testUsers.bob.password, () => {}, (reg) => {bobId = reg;});
        if (!bobId) {
            console.log('Bob ID is undefined');
        }
        else {
            logResult('Register Bob', bobId);
        }
        
        // Step 2: Test login
        console.log('2. Testing login functionality...');
        await login(testUsers.alice.email, testUsers.alice.password, () => {}, (login) => {aliceId = login;});
        logResult('Login Alice', aliceId);
        await login(testUsers.bob.email, testUsers.bob.password, () => {}, (login) => {bobId = login;});
        logResult('Login Bob', bobId);
        
        // Step 3: Update personalities
        console.log('3. Updating user personalities...');
        await updatePers(testUsers.alice.personality, aliceId, () => {});
        
        const updateBobPers = await updatePers(testUsers.bob.personality, bobId, () => {});
        
        // Step 4: Create a team
        console.log('4. Creating a test team...');
        teamId = null;
        await createTeam(testTeam.name, aliceId, () => {}, (team) => {teamId = team;});
        if (!teamId) {
            console.log('Team ID is undefined');
        }
        else {
            logResult('Create Team', teamId);
        }
        
        // Step 5: Get teams for Alice
        console.log('5. Getting teams for Alice...');
        await getTeams(aliceId, () => {}, (teams) => {aliceTeams = teams;});
        logResult('Get Alice Teams', aliceTeams);
        
        // Step 6: Invite Bob to the team
        console.log('6. Inviting Bob to the team...');
        inviteBob = null;
        await invite(testUsers.bob.email, aliceTeams[0].tid, () => {}, (invite) => {inviteBob = invite;});
        logResult('Invite Bob', inviteBob);
        
        // Step 7: Get team members
        console.log('7. Getting team members...');
        await getMembers(aliceTeams[0].tid, () => {}, (members) => {teamMembers = members;});
        logResult('Get Team Members', teamMembers);

        // Step 7.5: Bob approves the invite
        console.log('7.5. Bob approves the invite...');
        await acceptInvite(aliceTeams[0].tid, bobId, () => {});
        
        // Step 8: Approve Bob as a team member
        console.log('8. Approving Bob as a team member...');
        const approveBob = await makeMember(aliceTeams[0].tid, bobId, () => {});
        logResult('Approve Bob', approveBob);
        
        // Step 9: Get updated team members
        console.log('9. Getting updated team members...');
        await getMembers(aliceTeams[0].tid, () => {}, (members) => {updatedTeamMembers = members;});
        logResult('Get Updated Team Members', updatedTeamMembers);
        
        // Step 10: Get Bob's personality
        console.log('10. Getting Bob\'s personality...');
        await getPers(bobId, () => {}, (personality) => {bobPersonality = personality;});
        logResult('Get Bob Personality', bobPersonality);
        
        // Step 11: Bob's teams (should now include the team)
        console.log('11. Getting Bob\'s teams...');
        await getTeams(bobId, () => {}, (teams) => {bobTeams = teams;});
        logResult('Get Bob Teams', bobTeams);
        
        console.log('\nAll tests completed successfully!');
        
    } catch (error) {
        console.error('\nTest failed:', error);
    }
}

// Run the tests
runTests();