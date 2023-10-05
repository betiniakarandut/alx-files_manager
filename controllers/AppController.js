import dbClient from "../utils/db";
import redisClient from "../utils/redis";


class AppController{  
    static getStatus(res, req){
        res.status(200);
        res.json({redis: redisClient.isAlive(), db: dbClient.isAlive()});
        return;        
    }

    static async getStats(res, req){
        try {
            users = await dbClient.nbUsers();
        files = await dbClient.nbFiles()
        res.status(200);
        res.json({users: users, files: files})
        } catch (err) {
            res.status(400).json({error: err.message});
        }
    }
}

const AppController = new AppController();
export default AppController;