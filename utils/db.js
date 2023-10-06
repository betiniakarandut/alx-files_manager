import { MongoClient } from "mongodb";

const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 27017;
const DATABASE_NAME = process.env.DB_DATABASE || 'files_manager';

class DBClient{
    constructor(){
        try {
            this.uri = `mongo://${HOST}:${PORT}`;
            this.client = new MongoClient(uri, { 
                useNewUrlParser: true, 
                useUnifiedTopology: true });
            this.client.connect();
            this.DB = this.client.db(DATABASE_NAME);
        } catch (error) {
            console.log(error);
        }
    }

    isAlive(){
        return this.client.isConnected();
    }

    async nbUsers(){
        const collection = db.collection('users');
        const users = await collection.countDocuments();
        return users;
    }

    async nbFiles(){
        const collection = db.collection('files');
        const files = await collection.countDocuments();
        return files;
    }
}

const dbClient = new DBClient();
export default dbClient;