require('dotenv').config()

const Task = require('../models/Task');
const User = require('../models/User');

const isHasAccess = async (req, res, next) => {
    try {
        const task = await Task.findOne({ _id: req.params.id })
        const user = await User.findOne({ _id: req.decodedToken._id })

        if (user.status === "ban") {
            console.log("[isHasAccess (isNotBanned)] User banned.");
            return res.status(401).json({ error: "User banned." })
        }

        if ((task.author.toString() !== req.decodedToken._id) && (user.status !== "admin")) {
            console.log("[isHasAccess] Access denied.");
            return res.status(401).json({ error: "Access denied." })
        }

        console.log(`[isHasAccess] ${user.username} passed access check.`);
        next()
    } catch (e) {
        console.log("[isHasAccess] Unknown error.");
        res.status(520).json({ error: "Unknown error." })
    }
}

module.exports = isHasAccess;