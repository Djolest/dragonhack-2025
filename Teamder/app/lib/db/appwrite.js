// Import required modules
import { Account, Client, Databases, Storage, ID, Query } from 'appwrite';
import { redirect } from 'next/navigation.js';
import { revalidatePath } from 'next/cache.js';

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
        // Check if the user already exists
        const existingUser = await database.listDocuments(
            dbId,
            colUsers,
            [
                Query.equal('email', email),
            ]
        );
        if (existingUser.total > 0) {
            return {
                error: 'User already exists'
            };
        }

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

        // Create a new user key
        feedback(200);
        setUser(user.$id);
    } catch (error) {
        console.error('Registration error:', error);
        feedback(400);
        // Return appropriate error message
        return {
            error: error.message || 'Registration failed'
        };
    }
}

export async function updatePers(personality, userId, feedback) {
    try {
        // Update the user's personality in the database
        const updatedUser = await database.updateDocument(dbId, colUsers, userId, { personality });
        
        // Return the updated user object
        feedback(200);
    } catch (error) {
        console.error('Update personality error:', error);
        feedback(400);
        // Return appropriate error message
        return {
            error: error.message || 'Update failed'
        };
    }
}

// ===== TEAMS =====

export async function getTeams(userId, feedback, setTeams) {
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
        const formattedTeams = memberships.documents.map(membership => ({
            name: membership.tid.name,
            tid: membership.tid.$id,
        }));
        console.log('Formatted teams:', formattedTeams);

        // If no teams found, return empty array
        if (formattedTeams.length === 0) {
            feedback(200);
            return [];
        }
        
        // Set teams in state
        feedback(200);
        setTeams(formattedTeams);
    } catch (error) {
        console.error('Get teams error:', error);
        feedback(400);
        return {
            error: error.message || 'Failed to fetch teams'
        };
    }
}

export async function createTeam(name, userId, feedback, setTeam) {
    try {
        // Check if the team already exists
        const existingTeam = await database.listDocuments(
            dbId,
            colTeams,
            [
                Query.equal('name', name),
            ]
        );
        if (existingTeam.total > 0) {
            return {
                error: 'Team already exists'
            };
        }
        
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
        feedback(200);
        setTeam(team.$id);
    } catch (error) {
        console.error('Create team error:', error);
        feedback(400);
        return {
            error: error.message || 'Failed to create team'
        };
    }
}

export async function getMembers(teamId, feedback, setMembers) {
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
        const formattedUsers = memberships.documents.map(membership => ({
            name: membership.uid.name,
            uid: membership.uid.$id,
            tid: membership.tid.$id,
            isPending: membership.isPending,
            accepted: membership.accepted
        }));

        // Set members in state
        feedback(200);
        setMembers(formattedUsers);
    } catch (error) {
        console.error('Get members error:', error);
        feedback(400);
        return {
            error: error.message || 'Failed to fetch team members'
        };
    }
}

export async function invite(email, teamId, feedback, setUser) {
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
        feedback(200);
        setUser({
            name: targetUser.name,
            uid: targetUser.$id,
        });
    } catch (error) {
        console.error('Invite error:', error);
        return {
            error: error.message || 'Failed to invite user'
        };
    }
}

export async function acceptInvite(teamId, userId, feedback) {
    try {
        // Find the pending membership
        const pendingMembership = await database.listDocuments(
            dbId,
            colTeamMemberships,
            [
                Query.equal('uid', userId),
                Query.equal('tid', teamId),
                Query.equal('isPending', true)
            ]
        );
        
        if (pendingMembership.documents.length === 0) {
            return {
                error: 'User is not a pending member of this team'
            };
        }

        console.log('Pending membership:', pendingMembership.documents[0]);
        
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

        console.log('Membership updated:', pendingMembership.documents[0].$id);
        
        // Return success message
        feedback(200);
    } catch (error) {
        console.error('Accept error:', error);
        feedback(400);
        return {
            error: error.message || 'Failed to accept invitation'
        };
    }
}

export async function makeMember(teamId, userId, feedback) {
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
        
        // Return success message
        feedback(200);
    } catch (error) {
        console.error('Make member error:', error);
        feedback(400);
        return {
            error: error.message || 'Failed to update member status'
        };
    }
}

export async function getPers(userId, feedback, setPersonality) {
    try {
        // Get the user document
        const user = await database.getDocument(
            dbId,
            colUsers,
            userId
        );
        
        // Set personality in state
        feedback(200);
        setPersonality(user.personality);
    } catch (error) {
        console.error('Get personality error:', error);
        feedback(400);
        return {
            error: error.message || 'Failed to fetch personality data'
        };
    }
}
