const Bcrypt = require('bcrypt');
const AppDB = global.App.require('models/app');
const log = global.App.require('lib/log');
const jwt = require('jsonwebtoken');

// Hash password
const hash = async (password, rounds) => {
    return await Bcrypt.hash(password, rounds);
}

// Basic authentication scheme
const validate = async (username, password) => {
    log.info(`Validating user ${username}`);
    try {
        // Retrieve user
        const user = await AppDB.getUserByName(username);
        if (!user) {
            log.info(`User ${username} does not exist`);
            return { credentials: null, isValid: false };
        }

        const isValid = await Bcrypt.compare(password, user.password);
        const credentials = { id: user.id, name: user.name };

        return { isValid, credentials };
    } catch (err) {
        log.error(err);
        throw err;
    }

};

// Authorize JWT 
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    log.debug(`Token: ${token}`);
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, global.App.env.JWT_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        return next()
    });
};

module.exports = {
    hash,
    validate,
    authenticateToken,
}