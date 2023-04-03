const readline = require('readline-sync');

const settings = require('./appSettings');
const graphHelper = require('./graphHelper');

function initializeGraph(settings) {
    graphHelper.initializeGraphForUserAuth(settings, (info) => {
        // Display the device code message to
        // the user. This tells them
        // where to go to sign in and provides the
        // code to use.
        console.log(info.message);
    });
}

async function greetUserAsync() {
    try {
        const user = await graphHelper.getUserAsync();
        console.log(`Hello, ${user?.displayName}!`);
        // For Work/school accounts, email is in mail property
        // Personal accounts, email is in userPrincipalName
        console.log(`Email: ${user?.mail ?? user?.userPrincipalName ?? ''}`);
    } catch (err) {
        console.log(`Error: ${err}`);
    }
}

async function displayAccessTokenAsync() {
    try {
        const userToken = await graphHelper.getUserTokenAsync();
        console.log(`User token: ${userToken}`);
    } catch (err) {
        console.log(`Error: ${err}`);
    }
}

async function listInboxAsync() {
    try {
        const messagePage = await graphHelper.getInboxAsync();
        const messages = messagePage.value;

        // Output each message's details
        for (const message of messages) {
            console.log(`Message: ${message.subject ?? 'NO SUBJECT'}`);
            console.log(`  From: ${message.from?.emailAddress?.name ?? 'UNKNOWN'}`);
            console.log(`  Status: ${message.isRead ? 'Read' : 'Unread'}`);
            console.log(`  Received: ${message.receivedDateTime}`);
        }

        // If @odata.nextLink is not undefined, there are more messages
        // available on the server
        const moreAvailable = messagePage['@odata.nextLink'] != undefined;
        console.log(`\nMore messages available? ${moreAvailable}`);
    } catch (err) {
        console.log(`Error: ${err}`);
    }
}

async function listUsersAsync() {
    try {
        const usersPage = await graphHelper.getUsersAsync();
        const users = usersPage.value;

        // Output each user's details
        for (const user of users) {
            console.log(`User: ${user.displayName ?? 'NO NAME'}`);
            console.log(`  ID: ${user.id}`);
            console.log(`  Email: ${user.mail ?? 'NO EMAIL'}`);
        }

        // If @odata.nextLink is not undefined, there are more users
        // available on the server
        const moreAvailable = usersPage['@odata.nextLink'] != undefined;
        console.log(`\nMore users available? ${moreAvailable}`);
    } catch (err) {
        console.log(`Error: ${err}`);
    }
}

async function listJoinedTeamsAsync() {
    try {
        const teamsPage = await graphHelper.getJoinedTeams();
        const teams = teamsPage.value;

        // Output each teams's details
        for (const team of teams) {
            console.log(`Team: ${team.displayName ?? 'NO NAME'}`);
            console.log(`  ID: ${team.id}`);
            console.log(`  Description: ${team.description ?? 'NO DESCRIPTION'}`);
        }

    } catch (err) {
        console.log(`Error: ${err}`);
    }
}

async function customRequestAsync(request) {
    try {
        const customPage = await graphHelper.getCustomRequest(request);
        const custom = customPage;

        // Output
        console.log(custom);

    } catch (err) {
        console.log(`Error: ${err}`);
    }
}

initializeGraph(settings);

async function main() {
    console.log('JavaScript Graph Test');

    let choice = 0;

    // Initialize Graph
    initializeGraph(settings);

    // Greet the user by name
    await greetUserAsync();

    const choices = [
        'Display access token',
        'List my inbox',
        'List users',
        'List joined Teams',
        'Custom request'
    ];

    while (choice != -1) {
        choice = readline.keyInSelect(choices, 'Select an option', { cancel: 'Exit' });
        switch (choice) {
            case -1:
                // Exit
                console.log('Goodbye...');
                break;
            case 0:
                // Display access token
                await displayAccessTokenAsync();
                break;
            case 1:
                // List emails from user's inbox
                await listInboxAsync();
                break;
            case 2:
                // List users
                await listUsersAsync();
                break;
            case 3:
                // list Joined Teams
                await listJoinedTeamsAsync();
                break;
            case 4:
                // Make any Graph request
                await customRequestAsync(readline.question("Which request? ", { limit: null }));
                break;
            default:
                console.log('Invalid choice! Please try again.');
        }
    }
}

main();