const User = require('../models/user');
const Follow = require('../models/follower');
const Post = require('../models/post');

const mongoosePaginate = require('mongoose-pagination');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');
const post = require('../models/post');

function home(req, res) {
    res.status(200).send({
        message: 'ruta de pruebas'
    });
}
function pruebas(req, res) {
    return res.status(200).send({ message: 'la ruta del metodo prueba' })
}

function saveUser(req, res) {
    const params = req.body;
    const user = new User();
    if (params.name && params.surname && params.nick && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;

        // validadcion de duplicados
        User.find({
            $or: [
                { email: user.email.toLowerCase() },
                { nick: user.nick.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) return status(500).send({ message: "error la peticion de usuarios" });

            if (users && users.length >= 1) {
                return res.status(200).send({ message: "el usuario ya existe" });
            } else {
                //cifrado y guardado
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if (err) return status(500).send({ message: "error al guardar" });
                        if (userStored) {
                            res.status(200).send({ user: userStored });
                        }
                        else {
                            res.status(404).send({ message: 'no se ha registrado el usuario' });
                        }
                    });
                });
            }
        });

    } else {
        res.status(200).send({
            message: "envia todos los campos"
        });
    }
}

function loginUser(req, res) {
    const params = req.body;
    const email = params.email
    const password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return status(500).send({ message: "en la peticion" });

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    //regresar datos de usuarios
                    if (params.getToken) {
                        //token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        user.password = undefined;
                        return res.status(200).send({ user });
                    }
                } else {
                    res.status(404).send({ message: 'No se ha podido iniciar sesion' });
                }
            });
        } else {
            res.status(404).send({ message: 'El usuario no se ha identificado !!' });
        }
    });
}

function getUser(req, res) {
    const userId = req.params.id;


    User.findById(userId, (err, user) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });

        if (!user) return res.status(404).send({ message: 'El usuario no existe' });

        followsPerUsers(req.user.sub, userId).then((value) => {
            user.password = undefined;
            return res.status(200).send({
                user,
                following: value.following,
                followed: value.followed
            });
        });

    });
}

async function followsPerUsers(loggedUser, queryIdUser) {

    var following = await Follow.findOne({ 'user': loggedUser, 'followed': queryIdUser }).exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });

    var followed = await Follow.findOne({ 'user': queryIdUser, 'followed': loggedUser }).exec().then((follow) => {
        return follow;
    }).catch((err) => {
        return handleError(err);
    });

    return {
        following: following,
        followed: followed
    }
}

function getUsers(req, res) {
    const loggedUserId = req.user.sub;
    let page = 1;
    if (req.params.page) {
        page = req.params.page
    }
    let itemsPerPage = 5
    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!users) return res.status(404).send({ message: 'No existen registros de usuarios' });
        followsUsersId(loggedUserId).then((value) => {

            return res.status(200).send({
                users,
                usersFollowing: value.following,
                userFollowMe: value.followers,
                total,
                pages: Math.ceil(total / itemsPerPage)
            });
        })
    });
}

async function followsUsersId(userId) {
    let following = await Follow.find({ "user": userId }).select({ '_id': 0, '__v': 0, 'user': 0 }).exec().then((following) => {
        let followsArray = [];
        for (const follower of following) {
            followsArray.push(follower.followed);
        }
        return followsArray;
    }).catch((err) => {
        return handleError(err);
    });

    let followers = await Follow.find({ "followed": userId }).select({ '_id': 0, '__v': 0, 'followed': 0 }).exec().then((followers) => {
        let followsArray = [];
        for (const follower of followers) {
            followsArray.push(follower.user);
        }
        return followsArray;
    }).catch((err) => {
        return handleError(err);
    });

    return {
        following: following,
        followers: followers
    }
}

function editUser(req, res) {
    const userId = req.params.id;
    const update = req.body;

    delete update.password;

    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para editar usuario' });
    }

    User.find({
        $or: [
            { email: update.email.toLowerCase() },
            { nick: update.nick.toLowerCase() }
        ]
    }).exec((err, users) => {
        let userIsset = false;
        for (const user of users) {
            if (user && user._id != userId) userIsset = true;
        }
        
        if (userIsset) return res.status(404).send({ message: 'Los datos ya estan en uso' });

        User.findOneAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });

            if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });

            return res.status(200).send({ user: userUpdated });
        });
    });

}


function uploadImage(req, res) {
    const userId = req.params.id;

    if (req.files) {

        const filePath = req.files.image.path;
        const fileSpit = filePath.split('/');
        const fileName = fileSpit[2];
        const extSplit = fileName.split('\.')
        const fileExt = extSplit[1];

        if (userId != req.user.sub) {
            return removeFilesOfUpload(res, 500, filePath, 'No tienes permiso para editar la foto');
        }

        if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {

            User.findOneAndUpdate(userId, { image: fileName }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' });

                if (!userUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });

                return res.status(200).send({ user: userUpdated });
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
    const pathFile = `./uploads/users/${imageFile}`;
    fs.exists(pathFile, (exits) => {
        if (exits) {
            res.sendFile(path.resolve(pathFile));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }
    });
}

function getMetrics(req, res) {
    let userId = req.user.sub;
    if (req.params.id) {
        userId = req.params.id;
    }

    countUserData(userId).then((value) => {
        return res.status(200).send(value);
    });
}

async function countUserData(userID) {
    let following = await Follow.countDocuments({ "user": userID }).exec().then((count) => {
        return count;
    }).catch((err) => {
        return handleError(err);
    });

    let followers = await Follow.countDocuments({ "followed": userID }).exec().then((count) => {
        return count;
    }).catch((err) => {
        return handleError(err);
    });

    let posts = await Post.countDocuments({ "user": userID }).exec().then((count) => {
        return count;
    }).catch((err) => {
        return handleError(err);
    });

    return {
        following: following,
        followers: followers,
        posts: posts
    }
}


module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    editUser,
    uploadImage,
    getImageFile,
    getMetrics
}