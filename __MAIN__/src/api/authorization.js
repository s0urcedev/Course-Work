import { MongoClient } from 'mongodb';
import { settings } from '../settings';

export async function registerUser(name, email, password) {
    const client = new MongoClient(settings.authDBURL);
    const collectionUsers = client.db('users').collection('users');
    await client.connect();
    if (await collectionUsers.findOne({ email: email }) === null) {
        await collectionUsers.insertOne({ name: name, email: email, password: password });
        await client.close();
        return 200;
    } else {
        await client.close();
        return 400;
    }
}

export async function loginUser(email, password) {
    const client = new MongoClient(settings.authDBURL);
    const collectionUsers = client.db('users').collection('users');
    await client.connect();
    if (await collectionUsers.findOne({ email: email, password: password }) !== null) {
        await client.close();
        return 200;
    } else {
        await client.close();
        return 400;
    }
}