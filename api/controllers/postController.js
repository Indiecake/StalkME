const path = require('path');
const fs = require('fs');
const moment = require('moment');
const pagination = require('mongoose-pagination');

const Publication = require('../models/post');
const User = require('../models/user');
const Follows = require('../models/follower');
const user = require('../models/user');

function test(req, res) {
    return res.status(200).send({ message: 'post Controllers' });
}

function savePost(req, res) {
    const params = req.body;

    if (!params.text) return res.status(200).send({ message: 'Debes de enviar un texto' });

    let post = new Publication();
    post.text = params.text;
    post.file = null;
    post.user = req.user.sub;
    post.createdAt = moment().unix();

    post.save((err, postStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar la publicacion' });

        if (!postStored) return res.status(404).send({ message: 'La publicacion no ha sido guardada' });

        return res.status(200).send({ postStored });
    });
}

function getPosts(req, res) {
    let page = 1;
    const itemsPerPage = 4;
    const loggedUser = req.user.sub;
    if (req.params.page) page = req.params.page;


    Follows.find({ "user": loggedUser }).populate('followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });

        if (follows.length < 1) res.status(404).send({ message: 'No sigues a nadie' });
        let followsArray = [];

        for (const follower of follows) {
            followsArray.push(follower.followed);
        }
        followsArray.push(loggedUser);

        Publication.find({ "user": { "$in": followsArray } }).sort('-createdAt').populate('user')
            .paginate(page, itemsPerPage, (err, posts, total) => {

                if (err) return res.status(500).send({ message: 'Error al devolver publicacion' });

                if (posts.length < 1) res.status(404).send({ message: 'No hay niguna publicacion' });

                return res.status(200).send({
                    totalItems: total,
                    posts,
                    page: page,
                    pages: Math.ceil(total / itemsPerPage),
                    itemsPerPage
                });

            });
    });
}

function getPost(req, res) {
    let postId = req.params.id;

    Publication.findOne({ "_id": postId }, (err, post) => {
        if (err) return res.status(500).send({ message: 'Error al buscar la publicacion' });

        if (post.length < 1) res.status(404).send({ message: 'No existe la publicacion' });

        return res.status(200).send({ post });
    });
}

async function deletePost(req, res) {
    const currentUser = req.user.sub
    const postId = req.params.id;

    Publication.deleteOne({ 'user': currentUser, '_id': postId }, (err, postRemoved) => {

        if (err) return res.status(500).send({ message: 'Error al borrar la publicación.' });

        if (postRemoved.deletedCount == 0) return res.status(404).send({ message: 'No se ha borrado la publicación o no se ha podido encontrar.' });

        return res.status(200).send({ message: 'Publicacion eliminada' });
    });
}

function uploadImage(req, res) {
    const postId = req.params.id;

    if (req.files) {

        const filePath = req.files.image.path;
        const fileSpit = filePath.split('/');
        const fileName = fileSpit[2];
        const extSplit = fileName.split('\.')
        const fileExt = extSplit[1];

        if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {

            Publication.findOne({ "user": req.user.sub, '_id': postId }).exec((err, post) => {

                if (post) {
                    Publication.findByIdAndUpdate(postId, { file: fileName }, { new: true }, (err, postUpdated) => {
                        if (err) return res.status(500).send({ message: 'Error en la peticion' });

                        if (!postUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });

                        return res.status(200).send({ post: postUpdated });
                    });
                } else {
                    return removeFilesOfUpload(res, 403, filePath, 'No tienes permiso para modificar la publicacion');
                }
            });

        } else {
            return removeFilesOfUpload(res, 200, filePath, 'Extension no valida');
        }
    } else {
        return res.status(200).send({ message: 'No se han subido imagenes' });
    }
}

function removeFilesOfUpload(res, status, filePath, message) {
    fs.unlink(filePath, (err) => {
        res.status(status).send({ message: message });
    });
}

function getImageFile(req, res) {
    const imageFile = req.params.imageFile;
    const pathFile = `./uploads/publications/${imageFile}`;
    fs.exists(pathFile, (exits) => {
        if (exits) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    });
}


function getPostsPerUser(req, res) {
    let page = 1;
    const itemsPerPage = 4;
    let userId = req.user.sub;
    if (req.params.user) userId = req.params.user;
        
    if (req.params.page) page = req.params.page;


    Publication.find({ "user": userId }).sort('-createdAt').populate('user')
        .paginate(page, itemsPerPage, (err, posts, total) => {

            if (err) return res.status(500).send({ message: 'Error al devolver publicacion' });

            if (posts.length < 1) res.status(404).send({ message: 'No hay niguna publicacion' });

            return res.status(200).send({
                totalItems: total,
                posts,
                page: page,
                pages: Math.ceil(total / itemsPerPage),
                itemsPerPage
            });

        });
}

module.exports = {
    test,
    savePost,
    getPosts,
    getPost,
    deletePost,
    uploadImage,
    getImageFile,
    getPostsPerUser
}