// Import required modules
import { Account, Client, Databases, Storage, ID, Query } from 'appwrite';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Constants for database and collection IDs
const dbUrl = process.env.NEXT_PUBLIC_APPWRITE_URL || 'https://your-appwrite-endpoint/v1';
const dbProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'your-project-id';
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'your-database-id';
const colUsers = process.env.NEXT_PUBLIC_APPWEIRE_USERS || 'your-users-collection-id';
const colUserKeys = process.env.NEXT_PUBLIC_APPWRITE_USER_KEYS || 'your-user-keys-collection-id';
const colTeams = process.env.NEXT_PUBLIC_APPWRITE_TEAMS || 'your-teams-collection-id';
const colTeamMemberships = process.env.NEXT_PUBLIC_APPWRITE_TEAM_MEMBERSHIPS || 'your-team-memberships-collection-id';

// Initialize AppWrite client
const client = new Client()
    .setEndpoint(dbUrl)  // Your AppWrite endpoint
    .setProject(dbProjectId);               // Your AppWrite project ID

// Initialize services
const database = new Databases(client);

// ===== MODELS =====

const SchUser = {
    uid: ID.unique(),
    name: '',
    email: '',
    pw: '',
    personality: '',
}

const UserMemberships = {
    name: '',
    uid: '',
    tid: '',
    isPending: true,
    accepted: false,
}

const Team = {
    tid: ID.unique(),
    name: '',
}

// ===== AUTH =====

export async function login(email, password, feedback, setUser) {
    try {
        // Find the user by email
        const user = await database.listDocuments(
            dbId,
            colUsers,
            [
                Query.equal('email', email),
            ]
        );
        if (user.total === 0) {
            return {
                error: 'User not found'
            };
        }
        const userId = user.documents[0].$id;
        feedback(200);
        setUser(userId);
    } catch (error) {
        console.error('Login error:', error);
        feedback(400);
        // Return appropriate error message
        return {
            error: error.message || 'Authentication failed'
        };
    }
}

export const register = async(name, email, password, feedback, setUser) => {
    try {
        // Create a new user with the provided details
        const user = await database.createDocument(
            dbId,
            colUsers,
            ID.unique(), 
            {
                email: email,
                password: password,
                name: name,
                personality: '',
            }
        );
        feedback(200);
        setUser(user.$id);
        // Return the created user object
        console.log(user.$id);
    } catch (error) {
        console.error('Registration error:', error);
        feedback(400);
        // Return appropriate error message
        return {
            error: error.message || 'Registration failed'
        };
    }
}

async function updatePers(personality, userId) {
    try {
        // Update the user's personality in the database
        const updatedUser = await database.updateDocument(dbId, colUsers, userId, { personality });
        
        // Return the updated user object
        return {
            uid: updatedUser.$id,
        }
    } catch (error) {
        console.error('Update personality error:', error);
        
        // Return appropriate error message
        return {
            error: error.message || 'Update failed'
        };
    }
}

// ===== TEAMS =====

async function getTeams(userId) {
    try {
        // Query team memberships for the user
        const memberships = await database.listDocuments(
            dbId,
            colTeamMemberships,
            [
                Query.equal('uid', userId),
            ]
        );
        
        // Extract team IDs from memberships
        const teamIds = memberships.documents.map(membership => membership.teamId);
        
        if (teamIds.length === 0) {
            return { teams: [] };
        }
        
        // Fetch teams individually and combine results
        const teamsPromises = teamIds.map(teamId => 
            database.getDocument(dbId, colTeams, teamId)
        );
        
        const teamsResults = await Promise.all(teamsPromises);
        
        // Format team data for frontend
        const formattedTeams = teamsResults.documents.map(team => ({
            name: team.name,
            tid: team.$id
        }));
        
        return { teams: formattedTeams };
    } catch (error) {
        console.error('Get teams error:', error);
        return {
            error: error.message || 'Failed to fetch teams'
        };
    }
}

async function createTeam(name, userId) {
    try {
        // Create a new team
        const team = await database.createDocument(
            dbId,
            colTeams,
            ID.unique(),
            { name: name }
        );
        
        // Create membership for the creator (not pending, already accepted)
        await database.createDocument(
            dbId,
            colTeamMemberships,
            ID.unique(),
            {
                uid: userId,
                tid: team.$id,
                isPending: false,
                accepted: true
            }
        );
        
        // Return the created team
        return {
            tid: team.$id,
        };
    } catch (error) {
        console.error('Create team error:', error);
        return {
            error: error.message || 'Failed to create team'
        };
    }
}

async function getMembers(teamId) {
    try {
        // First check if the user is a proper member of the team
        const memberships = await database.listDocuments(
            dbId,
            colTeamMemberships,
            [
                Query.equal('tid', teamId),
            ]
        );
        
        // Get all user IDs from memberships
        const userIds = memberships.documents.map(membership => membership.userId);
        
        // Get user details for all members
        const usersPromises = userIds.map(userId => 
            database.getDocument(dbId, colUsers, userId)
        );
        const users = await Promise.all(usersPromises);
        
        // Map users to required format with membership status
        const formattedUsers = users.documents.map(user => {
            const membership = memberships.documents.find(m => m.userId === user.$id);
            return {
                name: user.name,
                uid: user.$id,
                tid: teamId,
                isPending: membership.isPending,
                accepted: membership.accepted
            };
        });
        
        return { users: formattedUsers };
    } catch (error) {
        console.error('Get members error:', error);
        return {
            error: error.message || 'Failed to fetch team members'
        };
    }
}

async function invite(email, teamId, userId) {
    try {
        
        // Look up the user by email
        const invitedUser = await database.listDocuments(
            dbId,
            colUsers,
            [Query.equal('email', email)]
        );
        
        if (invitedUser.documents.length === 0) {
            return {
                error: 'User not found'
            };
        }
        
        const targetUser = invitedUser.documents[0];
        
        // Check if user is already a member or pending
        const existingMembership = await database.listDocuments(
            dbId,
            colTeamMemberships,
            [
                Query.equal('uid', targetUser.$id),
                Query.equal('tid', teamId)
            ]
        );
        
        if (existingMembership.documents.length > 0) {
            return {
                error: 'User is already a member or has a pending invitation'
            };
        }
        
        // Create a pending membership
        await database.createDocument(
            dbId,
            colTeamMemberships,
            ID.unique(),
            {
                uid: targetUser.$id,
                tid: teamId,
                isPending: true,
                accepted: false
            }
        );
        
        // Return the invited user details
        return {
            user: {
                name: targetUser.name,
                id: targetUser.$id
            }
        };
    } catch (error) {
        console.error('Invite error:', error);
        return {
            error: error.message || 'Failed to invite user'
        };
    }
}

async function makeMember(teamId, userId) {
    try {
        
        // Find the pending membership
        const pendingMembership = await database.listDocuments(
            dbId,
            colTeamMemberships,
            [
                Query.equal('uid', userId),
                Query.equal('tid', teamId),
                Query.equal('isPending', true),
                Query.equal('accepted', true)
            ]
        );
        
        if (pendingMembership.documents.length === 0) {
            return {
                error: 'User is not a pending member of this team or hasnt yet accepted'
            };
        }
        
        // Update the membership status
        await database.updateDocument(
            dbId,
            colTeamMemberships,
            pendingMembership.documents[0].$id,
            {
                isPending: false,
                accepted: true
            }
        );
        
        return { success: true };
    } catch (error) {
        console.error('Make member error:', error);
        return {
            error: error.message || 'Failed to update member status'
        };
    }
}

async function getPers(userId) {
    try {
        // Get the user document
        const user = await database.getDocument(
            dbId,
            colUsers,
            userId
        );
        
        // Return the personality data
        return {
            personality: user.personality || '{}'
        };
    } catch (error) {
        console.error('Get personality error:', error);
        return {
            error: error.message || 'Failed to fetch personality data'
        };
    }
}

// Export all functions for use in your API routes
/*module.exports = {
    login,
    register,
    updatePers,
    getTeams,
    createTeam,
    getMembers,
    invite,
    makeMember,
    getPers
};
