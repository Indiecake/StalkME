const express = require('express');
const messageController = require('../controllers/messageController');
const api = express.Router();

const mdAuth = require('../middlewares/auth');

api.post('/message', mdAuth.ensureAuth, messageController.saveMessage);
api.get('/messages/received/:page?', mdAuth.ensureAuth, messageController.getReceivedMessages);
api.get('/messages/sended/:page?', mdAuth.ensureAuth, messageController.getEmittedMessages);
api.get('/messages/unviewed', mdAuth.ensureAuth, messageController.getUnviewedMessages);
api.get('/messages/readMessages', mdAuth.ensureAuth, messageController.readMessages);

module.exports = api;