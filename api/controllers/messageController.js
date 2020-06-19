const moment = require('moment');
const paginate = require('mongoose-pagination');

const User = require('../models/user')
const Follower = require('../models/follower');
const Message = require('../models/message');
const message = require('../models/message');

function saveMessage(req, res) {
    const params = req.body;

    if (!params.text && !params.receiver) return res.status(200).send({ message: 'Envia los datos necesarios' });

    let message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.createdAt = moment().unix();
    message.viewed = false;

    message.save((err, messageStored) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!messageStored) return res.status(500).send({ message: 'Error al enviar el mensaje' });

        return res.status(200).send({ message: messageStored });
    });
}

function getReceivedMessages(req, res) {
    const loggedUser = req.user.sub;
    let page = 1;
    if (req.params.page) page = req.params.page;
    const itemsPerPage = 5;

    Message.find({ receiver: loggedUser }).populate('emitter', 'name surname nick image _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!messages) return res.status(404).send({ message: 'No hay mensajes' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        });
    })
}

function getEmittedMessages(req, res) {
    const loggedUser = req.user.sub;
    let page = 1;
    if (req.params.page) page = req.params.page;
    const itemsPerPage = 5;

    Message.find({ emitter: loggedUser }).populate('emitter, receiver', 'name surname nick image _id').paginate(page, itemsPerPage, (err, messages, total) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!messages) return res.status(404).send({ message: 'No hay mensajes' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / itemsPerPage),
            messages
        });
    })
}

function getUnviewedMessages(req, res) {
    const loggedUser = req.user.sub;

    Message.countDocuments({ receiver: loggedUser, viewed: false }).exec((err, count) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        return res.status(200).send({
            'unViewedMessages': count
        });
    });
}

function readMessages(req, res) {
    const loggedUser = req.user.sub;

    Message.update({ receiver: loggedUser, viewed: false }, { viewed: true }, { "multi": true }, (err, messageUpdated) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        return res.status(200).send({ messages: messageUpdated });
    });
}


module.exports = {
    saveMessage,
    getReceivedMessages,
    getEmittedMessages,
    getUnviewedMessages,
    readMessages
}