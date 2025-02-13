require('dotenv').config()

const express = require('express');
const User = require('../models/User');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

router.get('/admin/users', isAdmin, async (req, res) => {
    try {
        let userList = []

        const users = await User.find({}, { password: 0, __v: 0 });
        users.forEach((doc) => { userList.push(doc) })

        console.log("[GET admin/users] Shared userList successfully.");
        res.json(userList)
    } catch (e) {
        console.log("[GET admin/users] Unknown error.");
        res.status(520).json({error: "Unknown error."})
    }
})

module.exports = router;