const mongoose = require ('mongoose');
const schema = mongoose.Schema;

const postSchema = schema({
    text: String,
    file: String,
    createdAt: String,
    user: { type: schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Post', postSchema);