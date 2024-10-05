import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';

const app = express();
const PORT = 5000;


app.use(bodyParser.json());

//GET '/'
app.get('/', (req, res) => {
    console.info("GET request to endpoint '/' received.");

    res.send("Node Express API Server");
})

app.use('/users', usersRoutes);

app.listen(PORT, () => console.info(`Server is running on http://localhost:${PORT}`))
