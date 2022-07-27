const os = require('os');

const Auth = global.App.require('lib/auth');
const log = global.App.require('lib/log');
const jwt = require('jsonwebtoken');

async function test(req, res) {
    try {
        const result = {
            instance: global.App.name,
            version: global.App.packageJson.version,
            server: os.hostname(),
            port: global.App.port,
            status: 'up',
        };
        return res.json(result);
    } catch (err) {
        log.error(err);
        throw err;
    }
};

async function testAuth(req, res) {
    try {
        const result = {
            instance: global.App.name,
            version: global.App.packageJson.version,
            server: os.hostname(),
            port: global.App.port,
            status: 'up',
            user: req.user,
        };

        return res.json(result);
    } catch (err) {
        log.error(err);
        throw err;
    }
};

async function login(req, res) {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const auth = await Auth.validate(username, password);
        if (auth.isValid) {
            log.info(`User ${username} is valid`);
            const options = {
                audience: 'urn:audience:databus',
                issuer: 'urn:issuer:databusauth',
            }
            const accessToken = jwt.sign(auth.credentials, global.App.env.JWT_TOKEN_SECRET, options)
            return res.json({ accessToken });
        } else {
            return res.sendStatus(403);
        }


    } catch (err) {
        log.error(err);
        throw err;
    }
};

module.exports = {
    test,
    testAuth,
    login,
};
