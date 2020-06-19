const mongoose = require('mongoose');
const schema = mongoose.Schema;

const followerSchema = schema({
    user: { type: schema.Types.ObjectId, ref: 'User' },
    followed: { type: schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Follow', followerSchema);