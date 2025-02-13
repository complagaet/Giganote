require('dotenv').config()

const express = require('express');
const router = express.Router();

const isAdmin = require('../middleware/isAdmin');
const checkToken = require("../middleware/checkToken");
const isNotBanned = require("../middleware/isNotBanned");
const isHasAccess = require("../middleware/isHasAccess");

const Task = require("../models/Task");

router.post("/task", checkToken, isNotBanned, async (req, res) => {
    try {
        const { title, content } = req.body

        if (!(title && content)) {
            console.log("[POST task] All fields must be filled.");
            return res.status(520).json({error: "All fields must be filled."})
        }

        const task = new Task({
            title: title,
            content: content,
            author: req.decodedToken._id,
        })
        await task.save()

        console.log("[POST task] Task saved.");
        res.status(200).json({message: "Task saved."})
    } catch (e) {
        console.log("[POST task] Task creation error.");
        res.status(520).json({error: "Unknown error."})
    }
})

router.patch("/task/:id", checkToken, isHasAccess, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, completed } = req.body;

        if (!title && !content && completed === undefined) {
            console.log("[PATCH task] No fields provided for update.");
            return res.status(400).json({ error: "At least one field must be provided for update." });
        }

        const task = await Task.findOne({ _id: id });
        if (!task) {
            console.log("[PATCH task] Task not found or access denied.");
            return res.status(404).json({ error: "Task not found or access denied." });
        }

        if (title) task.title = title;
        if (content) task.content = content;
        if (completed !== undefined) task.completed = completed;

        await task.save();

        console.log("[PATCH task] Task updated successfully.");
        res.status(200).json({ message: "Task updated successfully." });
    } catch (e) {
        console.log("[PATCH task] Task update error.", e);
        res.status(520).json({ error: "Unknown error." });
    }
});

router.get("/tasks", checkToken, isNotBanned, async (req, res) => {
    try {
        const tasks = await Task.find({ author: req.decodedToken._id })

        console.log("[GET tasks] Tasks found")
        res.status(200).json(tasks)
    } catch (e) {
        console.log("[GET tasks] Task finding error.");
        res.status(520).json({error: "Unknown error."})
    }
})

router.get("/task/:id", checkToken, isHasAccess, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id })

        console.log("[GET task] Task sent.");
        res.status(200).json(task)
    } catch (e) {
        console.log("[GET task] Task view error.");
        res.status(520).json({error: "Unknown error."})
    }
})

router.delete("/task/:id", checkToken, isHasAccess, async (req, res) => {
    try {
        const task = await Task.deleteOne({ _id: req.params.id })

        console.log("[DELETE task] Task deleted.");
        res.status(200).json({ message: "Task deleted." })
    } catch (e) {
        console.log("[DELETE task] Deletion error.");
        res.status(520).json({error: "Unknown error."})
    }
})

module.exports = router;