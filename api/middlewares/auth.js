const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'working';
let payload;

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no cuenta con la cabecera de autenticacion' });
    }

    const token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'El token ha expirado' });
        }
    } catch (error) {
        return res.status(404).send({ message: 'El token no es valido' });
    }


    req.user = payload;

    next();
}