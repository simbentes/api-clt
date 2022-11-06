const express = require('express');
const router = express.Router();

/* GET */
router.get('/', (req, res) => {
  res.status(200).json({
    api: 'OverTV',
    msg: 'Olá!',
    version: '1.4.7',
  });
});

module.exports = router;
