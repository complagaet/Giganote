require('dotenv').config()

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017'

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(`${DB_URL}`).then(r => console.log(`Connected to MongoDB`));

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

app.use('/api', AuthRoutes)
app.use('/api', checkToken, AdminRoutes)
app.use('/api', TaskRoutes)
app.use('/api', UserRoutes)

app.get("/secured", checkToken, isAdmin, async (req, res) => {
    res.send("ok")
})

// Мега проверочка на наличие .env файлика чтобы классно быстренько собрать оттуда секретики
fs.access(".env", (error) => {
    error ? console.log("[.env] Not found!") : console.log("[.env] Found!");

    if (!error) {
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        })
    }
});