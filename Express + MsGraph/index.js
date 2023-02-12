const express = require('express');
const app = express();

const api = require('./protected/api');
const settings = require('./private/settings');
const logger = require('./protected/logger');

let loggerObj = new logger.Logger(`${__dirname}/protected/logs/app.log`);

async function initializeApi(settings) {
    await api.initializeGraphForUserAuth(settings, (info) => {
        console.log(info.message);
    });
}

async function greetUserAsync() {
    try {
        const user = await api.getUserAsync();
        console.log(`Hello, ${user.displayName}!`);
        console.log(`Email: ${user.mail ?? user.userPrincipalName ?? ''}`);
    } catch (err) {
        loggerObj.logHere(`'greetUserAsync' | Error: ${err}`);
    }
}

async function registerApp() {

    app.use(express.static(`${__dirname}/public/`))

    app.get('/', async (req, res) => {
        res.sendFile(`${__dirname}/public/index.html`);
    });

    app.get('/api/user', loggerObj.logIt('/api/user', 
        async (req, res) => {
            try {
                const user = await api.getUserAsync();
                
                if (user == null || user == undefined) {
                    res.status(204).send(user);
                    return 204;
                } else {
                    res.status(200).send(user);
                    return 200;
                }
            } catch (err) {
                loggerObj.logHere(`'/api/user' | Error: ${err}`);
                res.sendStatus(500);
                return 500;
            }
        }
    ));

    app.get('/api/inbox', loggerObj.logIt('/api/inbox',
        async (req, res) => {
            try {
                const messagePage = await api.getInboxAsync();
                const messages = messagePage.value;
                
                if (messages == null || messages == undefined) {
                    res.status(204).send(messages);
                    return 204;
                } else {
                    res.status(200).send(messages);
                    return 200;
                }
            } catch (err) {
                loggerObj.logHere(`'/api/inbox' | Error: ${err}`);
                res.sendStatus(500);
                return 500;
            }
        }
    ));

    app.get('/api/users', loggerObj.logIt('/api/users',
        async (req, res) => {
            try {
                const usersPage = await api.getUsersAsync();
                const users = usersPage.value;
                
                if (users == null || users == undefined) {
                    res.status(204).send(users);
                    return 204;
                } else {
                    res.status(200).send(users);
                    return 200;
                }
            } catch (err) {
                loggerObj.logHere(`'/api/users' | Error: ${err}`);
                res.sendStatus(500);
                return 500;
            }
        }
    ));

    app.get('/api/joinedTeams', loggerObj.logIt('/api/joinedTeams',
        async (req, res) => {
            try {
                const teamsPage = await api.getJoinedTeams();
                const teams = teamsPage.value;
                
                if (teams == null || teams == undefined) {
                    res.status(204).send(teams);
                    return 204;
                } else {
                    res.status(200).send(teams);
                    return 200;
                }
            } catch (err) {
                loggerObj.logHere(`'/api/joinedTeams' | Error: ${err}`);
                res.sendStatus(500);
                return 500;
            }
        }
    ));
    
    app.listen(3333, async () => {
        loggerObj.logHere('Listening on port http://localhost:3333');
    });
}

async function main() {
    await initializeApi(settings);

    loggerObj.logHere("API initialized");

    await greetUserAsync();

    loggerObj.logHere("API authorized");

    await registerApp();
}

main();