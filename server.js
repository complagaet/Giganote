require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017';

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const client = require('prom-client');
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Общее количество HTTP-запросов',
    labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter);

app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method,
            route: req.route?.path || req.path,
            status: res.statusCode,
        });
    });
    next();
});

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

mongoose.connect(`${DB_URL}`).then(() => console.log('Connected to MongoDB'));

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const checkToken = require('./middleware/checkToken');
const isAdmin = require('./middleware/isAdmin');
const isNotBanned = require('./middleware/isNotBanned');

const AuthRoutes = require('./routes/Auth');
const AdminRoutes = require('./routes/Admin');
const TaskRoutes = require('./routes/Tasks');
const UserRoutes = require('./routes/User');

app.use('/api', AuthRoutes);
app.use('/api', checkToken, AdminRoutes);
app.use('/api', TaskRoutes);
app.use('/api', UserRoutes);

app.get('/secured', checkToken, isAdmin, async (req, res) => {
    res.send('ok');
});

// Проверка наличия .env
fs.access('.env', (error) => {
    error ? console.log('[.env] Not found!') : console.log('[.env] Found!');
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
