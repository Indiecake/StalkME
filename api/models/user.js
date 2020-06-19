const mongoose = require ('mongoose');
const schema = mongoose.Schema;

const userSchema = schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', userSchema);