import sha1 from 'sha1'
import dbClient from "../utils/db";
import Queue from 'bull';

const user_queue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UsersController{
    static async postNew(res, req) {
        try {
            const { email, password} = req.body;

            if (!email){
                return res.status(400).json({error: 'Missing email'});
            }
            if (!password){
                return res.status(400).json({error: 'Missing password'})
            }
            const users = await dbClient.db.collection('users');
            const user = users.findOne({ email });
            if (user){
                return res.status(400).json({error: 'Already exist'});
            }

            const hashed_password = sha1(password);
            const store_user = await users.insertOne({ email, 'password':hashed_password});

            user_queue = users.add({Id: result.insertId, email})
            res.status(201).json({id: result.insertId, email});
        } catch (error) {
            res.status(500).json({error: 'Internally generatd error'});
        }
    }        
}