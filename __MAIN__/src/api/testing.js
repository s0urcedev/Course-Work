import { MongoClient, ObjectId } from 'mongodb';
import { settings } from '../settings.js';
import { calculateLevels, calculateLevelsIndexes } from '../tools/calculations.js';

const client = new MongoClient(settings.authDBURL);

const dbTesting = client.db('testing');
const collectionTests = dbTesting.collection('tests');
const collectionSession = dbTesting.collection('sessions');
const collectionResults = dbTesting.collection('results');

export async function getTest(id) {
    await client.connect();
    let res;
    try {
        res = await collectionTests.findOne({ _id: ObjectId(id) });
    } catch (err) {
        res = undefined;
    }
    await client.close();
    return res;
}

export async function getSession(id) {
    await client.connect();
    let res;
    try {
        res = await collectionSession.findOne({ _id: ObjectId(id) });
    } catch (err) {
        res = undefined;
    }
    await client.close();
    return res;
}

export async function getQuestion(sessionId) {
    let session = await getSession(sessionId);
    await client.connect();
    let res;
    try {
        res = await collectionTests.findOne({ _id: ObjectId(session['testId']) });
    } catch (err) {
        await client.close();
        res = undefined;
        return undefined;
    }
    await client.close();
    return {
        'text': res['questions'][session['levelsOfQuestionsIndexes'][session['currentQuestionLevel']]]['text'],
        'answers': [res['questions'][session['levelsOfQuestionsIndexes'][session['currentQuestionLevel']]]['rightAnswer'], ...res['questions'][session['levelsOfQuestionsIndexes'][session['currentQuestionLevel']]]['wrongAnswers']]
    };
}

export async function getUsersTests(authorsEmail) {
    await client.connect();
    let res;
    try {  
        res = await collectionTests.find({ authorsEmail: authorsEmail }).toArray();
    } catch (err) {
        res = undefined;
    }
    await client.close();
    return res;
}

export async function getResult(id) {
    await client.connect();
    let res;
    try {
        res = await collectionResults.findOne({ _id: ObjectId(id) });
    } catch (err) {
        res = undefined;
    }
    await client.close();
    return res;
}

export async function getTestsResults(id) {
    await client.connect();
    let res;
    try {  
        res = await collectionResults.find({ testId: id }).toArray();
    } catch (err) {
        res = undefined;
    }
    await client.close();
    return res;
}

export async function createTest(email) {
    await client.connect();
    let inseted = await collectionTests.insertOne({
        'authorsEmail': email,
        'name': 'Blank test',
        'numberOfQuestionsForStudent': 1,
        'numberOfQuestionsForTeacher': 1,
        'numberOfMaxPoints': 1,
        'questions': [
            {
                'text': 'Blank question',
                'rightAnswer': 'Blank right answer',
                'wrongAnswers': [
                    'Blank wrong answer'
                ],
                'numberOfAnswers': 2
            }
        ]
    });
    await client.close();
    return inseted.insertedId;
}

export async function deleteTest(id) {
    await client.connect();
    await collectionTests.deleteOne({ _id: ObjectId(id) });
    await client.close();
}

export async function editTest(id, object) {
    await client.connect();
    let status = 500;
    try {
        await collectionTests.replaceOne({ _id: ObjectId(id) }, object);
        status = 200;
    } catch (err) {
        status = 500;
    }
    await client.close();
    return status;
}

export async function startSession(id, userName) {
    let test = await getTest(id);
    await client.connect();
    let inserted = undefined;
    try {
        inserted = await collectionSession.insertOne({
            testId: id,
            testName: test['name'],
            userName: userName,
            startDate: new Date(),
            currentQuestionLevel: test['numberOfQuestionsForStudent'],
            counter: 0,
            levelsOfQuestionsIndexes: calculateLevelsIndexes(calculateLevels(test['numberOfQuestionsForStudent'])),
            score: 0,
            maxScore: test['numberOfMaxPoints']
        });
    } catch (err) {
        await client.close();
        return undefined;
    }
    await client.close();
    return inserted.insertedId;
}

export async function checkAnswer(sessionId, answer) {
    let session = await getSession(sessionId);
    await client.connect();
    let test;
    try {
        test = await collectionTests.findOne({ _id: ObjectId(session['testId']) });
    } catch (err) {
        await client.close();
        test = undefined;
        return undefined;
    }
    await client.close();
    if (answer === test['questions'][session['levelsOfQuestionsIndexes'][session['currentQuestionLevel']]]['rightAnswer']) {
        session['levelsOfQuestionsIndexes'][session['currentQuestionLevel']] ++;
        session['score'] += session['currentQuestionLevel'];
        session['currentQuestionLevel'] ++;
        session['counter'] ++;
    } else {
        session['levelsOfQuestionsIndexes'][session['currentQuestionLevel']] ++;
        session['currentQuestionLevel'] --;
        session['counter'] ++;
    }
    await client.connect();
    delete session.id;
    try {
        await collectionSession.replaceOne({ _id: ObjectId(sessionId) }, session);
    } catch (err) {
        await client.close();
        return undefined;
    }
    await client.close();
    if (session['counter'] >= test['numberOfQuestionsForStudent']) {
        await client.connect();
        let inserted = '';
        try {
            await collectionSession.deleteOne({ _id: ObjectId(sessionId) });
            inserted = await collectionResults.insertOne({
                testId: session['testId'],
                testName: session['testName'],
                userName: session['userName'],
                startDate: session['startDate'],
                endDate: new Date(),
                score: session['score'],
                maxScore: session['maxScore']
            });
        } catch (err) {
            await client.close();
            return undefined;
        }
        await client.close();
        return {
            'status': 'finished',
            'resultId': inserted.insertedId
        };
    } else {
        return {
            'status': 'ongoing'
        };
    }
}