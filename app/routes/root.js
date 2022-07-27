const express = require('express');
const router = express.Router();

const { authenticateToken } = global.App.require('lib/auth');
const Controller = global.App.require('controllers/root');

router.get('/test', Controller.test);
router.get('/testauth', authenticateToken, Controller.testAuth);
router.post('/login', Controller.login);

module.exports = router;
