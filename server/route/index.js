const express = require('express');
const router = express.Router();
var cors = require('cors');
router.use(cors());

router.use('/steps', require('./Steps'));

module.exports = router;