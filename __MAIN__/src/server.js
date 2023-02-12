import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import { getUser } from './api/users';
import { registerUser, loginUser } from './api/authorization';
import { getTest, getSession, getQuestion, getUsersTests, getResult, getTestsResults, createTest, deleteTest, editTest, startSession, checkAnswer } from './api/testing';
import { hash } from './security/hashing';
import cookieParser from 'cookie-parser';
import { calculateLevels, calculateLevelsIndexes } from './tools/calculations';
import { getGraphUser } from './api/msgraph';
import { decodeToken, generateToken } from './security/jwt';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const app = express();

app.use(compression({ threshold: 0 }));
app.use(sirv('static', { dev }));
app.use(cookieParser());
app.use(express.json());

// redirects ---

app.get([
    '/',
    '/authorization',
    '/authorization/login',
    '/authorization/register',
    '/testing',
    '/testing/choose-test',
    '/testing/edit-test',
    '/testing/start-session',
    '/testing/testing-session',
    '/testing/view-result',
    '/testing/view-tests-results',
], express.urlencoded({ extended: false }), async (req, res) => {
    res.redirect('/choose-language');
});

app.get('/en/authorization/', express.urlencoded({ extended: false }), async (req, res) => {
    res.redirect('/en/authorization/login');
});

app.get('/uk/authorization/', express.urlencoded({ extended: false }), async (req, res) => {
    res.redirect('/uk/authorization/login');
});

app.get('/en/testing/', express.urlencoded({ extended: false }), async (req, res) => {
    res.redirect('/en/testing/choose-test');
});

app.get('/uk/testing/', express.urlencoded({ extended: false }), async (req, res) => {
    res.redirect('/uk/testing/choose-test');
});

// -------------

async function isLoggedinAndValid(cookies) {
    if (cookies['token'] !== '') {
        try {
            let userToken = decodeToken(cookies['token']);
            let userDB = await getUser(userToken['email'], userToken['password']);
            return userDB !== null && userDB !== undefined && userDB !== {};
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
}

// api ---------

app.get('/api/users/get-user', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        if (req.cookies['token'] !== '') {
            try {
                let user = decodeToken(req.cookies['token']);
                res.send(await getUser(user['email'], user['password']));
            } catch (err) {
                res.send(401);
            }
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post('/api/authorization/register', express.urlencoded({ extended: false }), async (req, res) => {
    let status = 200, message = '';
    if (req.body.password === req.body.confirmPassword) {
        try {
            if (await registerUser(req.body.name, req.body.email, hash(req.body.password)) === 200) {
                status = 200;
                if ((req.headers.referer ?? '').includes('/uk')) {   
                    message = 'Теперь входіть';
                } else {
                    message = 'And now login';
                }
            } else {
                status = 400;
                if ((req.headers.referer ?? '').includes('/uk')) {   
                    message = 'Ця пошта вже зарегестрована. Спробуйте зайти';
                } else {
                    message = 'This email is already registered. Try to login';
                }
            }
        } catch (err) {
            status = 500;
            if ((req.headers.referer ?? '').includes('/uk')) {   
                message = 'Щось сталося на нашому боці';
            } else {
                message = 'Something went wrong on our side';
            }
        }
    } else {
        status = 400;
        if ((req.headers.referer ?? '').includes('/uk')) {   
            message = 'Пароль та пароль-підтвердження не співпадають';
        } else {
            message = 'Password and confirm password are not same';
        }
    }
    if (status === 200) {
        res.redirect(`/${(req.headers.referer ?? '').includes('/uk') ? 'uk' : 'en'}/authorization/login?message=${message}`);
    } else if (status === 400) {
        res.redirect(`/${(req.headers.referer ?? '').includes('/uk') ? 'uk' : 'en'}/authorization/register?message=${message}`);
    } else if (status === 500) {
        res.redirect(`/${(req.headers.referer ?? '').includes('/uk') ? 'uk' : 'en'}/authorization/register?message=${message}`);
    }
});

app.post('/api/authorization/authorize-for-teams', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        let user = await getGraphUser(req.body.id, req.body.organization);
        await registerUser(user.displayName, user.mail ?? user.userPrincipalName, hash(user.id));
        res.cookie('token', generateToken({ email: user.mail ?? user.userPrincipalName, password: hash(user.id) }), { sameSite: 'None', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true })
            .cookie('currentSessionId', '', { sameSite: 'None', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000 });
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post('/api/authorization/login', express.urlencoded({ extended: false }), async (req, res) => {
    let status = 200, message = '';
    try {
        if (await loginUser(req.body.email, hash(req.body.password)) === 200) {
            status = 200;
            res.cookie('token', generateToken({ email: req.body.email, password: hash(req.body.password) }), { sameSite: 'None', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true })
                .cookie('currentSessionId', '', { sameSite: 'None', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000 });
        } else {
            status = 400;
            if ((req.headers.referer ?? '').includes('/uk')) {   
                message = 'Неправильна пошта чи пароль';
            } else {
                message = 'Wrong email or password';
            }
            res.cookie('token', '', { sameSite: 'None', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true })
                .cookie('currentSessionId', '', { sameSite: 'None', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000 });
        }
    } catch (err) {
        status = 500;
        if ((req.headers.referer ?? '').includes('/uk')) {   
            message = 'Щось сталося на нашому боці';
        } else {
            message = 'Something went wrong on our side';
        }
        res.cookie('token', '', { sameSite: 'None', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true })
            .cookie('currentSessionId', '', { sameSite: 'None', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000 });
    }
    if (status === 200) {
        res.redirect(`/${(req.headers.referer ?? '').includes('/uk') ? 'uk' : 'en'}`);
    } else if (status === 400) {
        res.redirect(`/${(req.headers.referer ?? '').includes('/uk') ? 'uk' : 'en'}/authorization/login?message=${message}`);
    } else if (status === 500) {
        res.redirect(`/${(req.headers.referer ?? '').includes('/uk') ? 'uk' : 'en'}/authorization/login?message=${message}`);
    }
});

app.get('/api/authorization/sign-out', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        res.cookie('token', '', { sameSite: 'None', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true })
            .cookie('currentSessionId', '', { sameSite: 'None', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000 });
        res.redirect(`/${(req.headers.referer ?? '').includes('/uk') ? 'uk' : 'en'}`);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/api/testing/check-test', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        res.send({ name: (await getTest(req.query.id))['name'] });
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/api/testing/get-test', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        if (await isLoggedinAndValid(req.cookies)) {
            let test = await getTest(req.query.id);
            let user = {};
            try {
                user = decodeToken(req.cookies['token']);
            } catch (err) {
                res.sendStatus(401);
            }
            if (user['email'] === test['authorsEmail']) {
                res.send(test);
            } else {
                res.send({});
            }
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/api/testing/get-session', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        res.send(await getSession(req.cookies['currentSessionId']));
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/api/testing/get-question', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        res.send(await getQuestion(req.cookies['currentSessionId']));
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/api/testing/get-users-tests', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        if (await isLoggedinAndValid(req.cookies)) {
            res.send(await getUsersTests(req.query.authorsEmail));
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/api/testing/get-result', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        res.send(await getResult(req.query.id));
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/api/testing/get-tests-results', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        if (await isLoggedinAndValid(req.cookies)) {
            let test = await getTest(req.query.id);
            let user = {};
            try {
                user = decodeToken(req.cookies['token']);
            } catch (err) {
                res.sendStatus(401);
            }
            if (user['email'] === test['authorsEmail']) {
                res.send(await getTestsResults(req.query.id));
            } else {
                res.send({});
            }
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/api/testing/create-test', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        if (await isLoggedinAndValid(req.cookies)) {
            let user = {};
            try {
                user = decodeToken(req.cookies['token']);
            } catch (err) {
                res.sendStatus(401);
            }
            res.redirect(`/${(req.headers.referer ?? '').includes('/uk') ? 'uk' : 'en'}/testing/edit-test?id=${await createTest(user['email'])}`);
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.get('/api/testing/delete-test', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        if (await isLoggedinAndValid(req.cookies)) {
            let user = {};
            try {
                user = decodeToken(req.cookies['token']);
            } catch (err) {
                res.sendStatus(401);
            }
            if (user['email'] === (await getTest(req.query.id))['authorsEmail']) {
                try {
                    await deleteTest(req.query.id);
                    res.json({ url: `?message=${(req.headers.referer ?? '').includes('/uk') ? 'Видалено' : 'Deleted'}` });
                } catch (err) {
                    res.json({ url: `?message=${(req.headers.referer ?? '').includes('/uk') ? 'Вже видалено' : 'Is already deleted'}` });
                }
            } else {
                if ((req.headers.referer ?? '').includes('/uk')) {
                    res.redirect('/uk?message=Ви не власник цього тесту');
                } else {
                    res.redirect('/uk?message=You are not owner of that test');
                }
            }
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post('/api/testing/edit-test', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        if (await isLoggedinAndValid(req.cookies)) {
            let user = {};
            try {
                user = decodeToken(req.cookies['token']);
            } catch (err) {
                res.sendStatus(401);
            }
            if (user['email'] === (await getTest(req.body.id))['authorsEmail']) {
                let id = req.body.id;
                delete req.body.id;
                req.body['numberOfQuestionsForStudent'] = Number(req.body['numberOfQuestionsForStudent']);
                req.body['numberOfQuestionsForTeacher'] = Number(req.body['numberOfQuestionsForTeacher']);
                req.body['numberOfMaxPoints'] = Number(req.body['numberOfMaxPoints']);
                let levelsOfQuestionsIndexes = calculateLevelsIndexes(calculateLevels(Number(req.body['numberOfQuestionsForStudent'])));
                req.body['questions'] = [];
                for (let i = 1; i < levelsOfQuestionsIndexes.length; i ++) {
                    while (levelsOfQuestionsIndexes[i] < (i < levelsOfQuestionsIndexes.length - 1 ? levelsOfQuestionsIndexes[i + 1] : Number(req.body['numberOfQuestionsForTeacher']))) {
                        let question = {
                            'text': req.body[`question${levelsOfQuestionsIndexes[i] + 1}Level${i}Text`],
                            'rightAnswer': req.body[`question${levelsOfQuestionsIndexes[i] + 1}Level${i}RightAnswer`],
                            'wrongAnswers': [],
                            'numberOfAnswers': Number(req.body[`numberOfAnswers${levelsOfQuestionsIndexes[i] + 1}`])
                        };
                        delete req.body[`question${levelsOfQuestionsIndexes[i] + 1}Level${i}Text`];
                        delete req.body[`question${levelsOfQuestionsIndexes[i] + 1}Level${i}RightAnswer`];
                        delete req.body[`numberOfAnswers${levelsOfQuestionsIndexes[i] + 1}`];
                        for (let j = 1; j <= question['numberOfAnswers'] - 1; j ++) {
                            question['wrongAnswers'].push(req.body[`question${levelsOfQuestionsIndexes[i] + 1}Level${i}WrongAnswer${j}`]);
                            delete req.body[`question${levelsOfQuestionsIndexes[i] + 1}Level${i}WrongAnswer${j}`];
                        }
                        req.body['questions'].push(question);
                        levelsOfQuestionsIndexes[i] ++;
                    }
                }
                await editTest(id, req.body);
                res.redirect(`/${(req.headers.referer ?? '').includes('/uk') ? 'uk' : 'en'}/testing/edit-test?id=${id}&message=${(req.headers.referer ?? '').includes('/uk') ? 'Збережено' : 'Saved'}`);
            } else {
                if ((req.headers.referer ?? '').includes('/uk')) {
                    res.redirect('/uk?message=Ви не власник цього тесту');
                } else {
                    res.redirect('/uk?message=You are not owner of that test');
                }
            }
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post('/api/testing/start-session', express.urlencoded({ extended: false }), async (req, res) => {
    try {
        res.cookie('currentSessionId', await startSession(req.body['id'], req.body['userName']), { sameSite: 'None', secure: true, maxAge: 365 * 24 * 60 * 60 * 1000 });
        res.redirect(`/${(req.headers.referer ?? '').includes('/uk') ? 'uk' : 'en'}/testing/testing-session`);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.post('/api/testing/check-answer', express.urlencoded({ extended: true }), async (req, res) => {
    try {
        let answer = await checkAnswer(req.cookies['currentSessionId'], req.body.answer);
        if (answer !== undefined) {
            if (answer['status'] === 'finished') {
                res.send({
                    'status': 'finished',
                    'id': answer['resultId']
                });
            } else if (answer['status'] === 'ongoing') {
                res.send({
                    'status': 'ongoing'
                });
            }
        } else {
            res.sendStatus(500);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

// -------------

app.listen(PORT, async () => {
    console.log('Listening on port');
});

app.use(sapper.middleware());
