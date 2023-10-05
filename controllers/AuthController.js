import sha1 from 'sha1';
import { v4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController{
    static async getConnect(res, req){
        const auth = req.header('Authorization');
        const [ email, password ] = Buffer.from(auth.split(' ')[1], 'base64')
         .toString('ascii')
         .split(':');

        const users_collection = dbClient.db.collection('users');
        const hashed_password = sha1(password);
        const user = await users_collection.findOne({ email, 'password':password })

        if (!user){
            return res.status(401).json({error: 'Unauthorized'})
        }
        if (user.password != hashed_password){
            return res.status(401).json({error: 'Unauthorized'})
        }
        const token = v4();
        await redisClient.set(`auth_${token}`, user._id.toString(), 3600 * 24);
        return res.status(200).json({ token })
    }
}

const AuthController = new AuthController();
export default AuthController;