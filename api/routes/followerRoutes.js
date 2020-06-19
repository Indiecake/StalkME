const express = require('express');
const followerController = require('../controllers/followerController');
const api = express.Router();

const mdAuth = require('../middlewares/auth');

api.post('/follow', mdAuth.ensureAuth, followerController.saveFollower);
api.delete('/follow/:id', mdAuth.ensureAuth, followerController.deleteFollow);
api.get('/following/:id?/:page?', mdAuth.ensureAuth, followerController.getFollowingUsers);
api.get('/followers/:id?/:page?', mdAuth.ensureAuth, followerController.getFollowers);
api.get('/getMyFollows/:followed?', mdAuth.ensureAuth, followerController.getMyFollows);

module.exports = api;