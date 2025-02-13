const { Schema, model} = require('mongoose');

const schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "user" },
})

const User = model('user', schema);

module.exports = User;