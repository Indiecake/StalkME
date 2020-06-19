const express = require('express');
const messageController = require('../controllers/messageController');
const api = express.Router();

const mdAuth = require('../middlewares/auth');

api.post('/message', mdAuth.ensureAuth, messageController.saveMessage);
api.get('/myMessages/:page?', mdAuth.ensureAuth, messageController.getReceivedMessages);
api.get('/messages/:page?', mdAuth.ensureAuth, messageController.getEmittedMessages);
api.get('/unviewedMessages', mdAuth.ensureAuth, messageController.getUnviewedMessages);
api.get('/readMessages', mdAuth.ensureAuth, messageController.readMessages);

module.exports = api;