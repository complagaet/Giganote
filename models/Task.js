const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    completed: { type: Boolean, default: false },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

const Task = model("task", schema);

module.exports = Task