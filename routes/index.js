const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: "鄉民溫度計 - PTT電影版" });
});

module.exports = router;
