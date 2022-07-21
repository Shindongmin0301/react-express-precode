const logger = require('../config/winston');

const router = require('express').Router();

router.get('/home', (req, res) => {
  res.send('Hello');
});

module.exports = router;
