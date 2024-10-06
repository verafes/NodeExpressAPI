import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import path from 'path';
import log from './logger/logger.js';

const app = express();
const PORT = 5000;

let staticPath = path.join(path.resolve(), 'public');

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api/users', usersRoutes);

//GET '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
})

app.get('/', (req, res) => {
    log.info("GET request to endpoint '/' received.");

    res.send("Node Express API App");
})

app.use('/users', usersRoutes);

app.listen(PORT, () => log.server(`Server is running on http://localhost:${PORT}`))
