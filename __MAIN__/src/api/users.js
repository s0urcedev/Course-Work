import { MongoClient } from 'mongodb';
import { settings } from '../settings';

const client = new MongoClient(settings.authDBURL);

const dbUsers = client.db('users');
const collectionUsers = dbUsers.collection('users');

export async function getUser(email, password) {
    await client.connect();
    let res;
    try {
        res = await collectionUsers.findOne({ email: email, password: password });
    } catch (err) {
        await client.close();
        return undefined;
    }
    await client.close();
    return res;
}