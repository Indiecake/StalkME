const express = require('express');
const userController = require('../controllers/userController');
const api = express.Router();
const mdAuth = require('../middlewares/auth');
const multipart = require('connect-multiparty');
const mdUpload = multipart({uploadDir: './uploads/users'});

api.get('/home', userController.home);
api.get('/pruebas', mdAuth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.loginUser);
api.get('/user/:id', mdAuth.ensureAuth, userController.getUser);
api.get('/users/:page?', mdAuth.ensureAuth, userController.getUsers);
api.put('/updateUser/:id', mdAuth.ensureAuth, userController.editUser);
api.put('/uploadAvatar/:id', [mdAuth.ensureAuth, mdUpload], userController.uploadImage);
api.get('/getImageUser/:imageFile', userController.getImageFile);
api.get('/metrics/:id?', mdAuth.ensureAuth, userController.getMetrics);

module.exports = api;