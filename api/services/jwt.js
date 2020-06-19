const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'working';


exports.createToken =  (user) => {
    const payload = {
        sub: user._id,
        name: user.name,
        suername: user.suername,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }
    return jwt.encode(payload, secret)
}