const mongoose = require ('mongoose');
const schema = mongoose.Schema;

const messageSchema = schema({
    text: String,
    viewed: Boolean,
    createdAt: String,
    emitter: { type: schema.Types.ObjectId, ref: 'User' },
    receiver:  { type: schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Message', messageSchema);