import express from 'express';
import router from './routes/index';

const app = express();
app.use(express.json());

const Port = process.env.PORT || 5000;
const hostname = process.env.LOCALHOST || 'localhost';


app.use('/', router)

app.listen(Port, hostname, () => {
    console.log(`server is running on port ${Port}`)
});

module.exports = app;