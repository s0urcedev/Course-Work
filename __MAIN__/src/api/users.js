import { MongoClient } from 'mongodb';
import { settings } from '../settings';

export async function getUser(email, password) {
    const client = new MongoClient(settings.authDBURL);
    const collectionUsers = client.db('users').collection('users');
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