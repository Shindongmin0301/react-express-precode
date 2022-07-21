const router = require('express').Router();
const authCtrl = require('../controllers/Auth.ctrl');

router.post('/login', authCtrl.login);

module.exports = router;
