//const path = require('path');
//const fs = require('fs');
const mongoosePaginate = require('mongoose-pagination');

const User = require('../models/user');
const Follower = require('../models/follower');

function saveFollower(req, res) {
    const follower = new Follower();
    const params = req.body;
    follower.user = req.user.sub;
    follower.followed = params.followed;

    follower.save((err, followerStored) => {
        if (err) return res.status(500).send({ message: 'Error al seguir al usuario' });

        if (!followerStored) return res.status(404).send({ message: 'No se ha podido seguir al usuario' });

        return res.status(200).send({ data: followerStored });
    })
}

function deleteFollow(req, res) {
    const userId = req.user.sub;
    const followId = req.params.id;

    Follower.deleteOne({ 'user': userId, 'followed': followId }, (err, postRemoved) => {

        if (err) return res.status(500).send({ message: 'Error al dejar de seguir.' });

        if (postRemoved.deletedCount == 0) return res.status(404).send({ message: 'No se ha dejado de seguir.' });

        return res.status(200).send({ message: 'Has dejado a seguirlo' });
    });
}

function getFollowingUsers(req, res) {
    let loggedUser = req.user.sub;
    if (req.params.id && req.params.page) {
        loggedUser = req.params.id;
    }

    let page = 1;
    if (req.params.page) {
        page = req.params.page
    } else {
        page = req.params.id;
    }

    let itemsPerPage = 4;
    Follower.find({ user: loggedUser }).populate({
        path: 'followed'
    }).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });

        if (follows.length < 1) return res.status(404).send({ message: 'No estas siguiendo a ningun usuario' });

        return res.status(200).send({
            total: total,
            page: Math.ceil(total / itemsPerPage),
            follows
        });
    });
}

function getFollowers(req, res) {
    let loggedUser = req.user.sub;
    if (req.params.id && req.params.page) {
        loggedUser = req.params.id;
    }

    let page = 1;
    if (req.params.page) {
        page = req.params.page
    } else {
        page = req.params.id;
    }

    let itemsPerPage = 4;
    Follower.find({ followed: loggedUser }).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });

        if (follows.length < 1) return res.status(404).send({ message: 'No te sigue ningun usuario' });

        return res.status(200).send({
            total: total,
            page: Math.ceil(total / itemsPerPage),
            follows
        });
    });
}


function getMyFollows(req, res) {
    let loggedUser = req.user.sub;
    let find;

    if (req.params.followed) {
        find = Follower.find({ followed: loggedUser })
    } else {
        find = Follower.find({ user: loggedUser })
    }

    find.populate('user followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Error en el servidor' });

        if (follows.length < 1) return res.status(404).send({ message: 'No estas siguiendo a ningun usuario' });

        return res.status(200).send({ follows });
    });
}


module.exports = {
    saveFollower,
    deleteFollow,
    getFollowingUsers,
    getFollowers,
    getMyFollows
}