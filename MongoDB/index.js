const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:01Gleb09@course-work-cluster-0.mkq6tew.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);

// Database Name
const dbName = 'mydb';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('test');
    const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
    console.log('Inserted documents =>', insertResult);

    return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());