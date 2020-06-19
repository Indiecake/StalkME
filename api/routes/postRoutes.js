const express = require('express');
const api = express.Router();
const multipart = require('connect-multiparty');
const mdUpload = multipart({uploadDir: './uploads/publications'});

const mdAuth = require('../middlewares/auth');

const postController = require('../controllers/postController');
const post = require('../models/post');

api.get('/testPost', mdAuth.ensureAuth, postController.test);
api.post('/savePost', mdAuth.ensureAuth, postController.savePost);
api.get('/posts/:page?', mdAuth.ensureAuth, postController.getPosts);
api.get('/post/:id?', mdAuth.ensureAuth, postController.getPost);
api.delete('/deletePost/:id', mdAuth.ensureAuth, postController.deletePost);
api.put('/uploadPostImage/:id', [mdAuth.ensureAuth, mdUpload], postController.uploadImage);
api.get('/getPostImage/:imageFile', postController.getImageFile);

module.exports = api;