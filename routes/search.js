const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
/* GET home page. */
router.post('/', async function(req, res, next) {
  let { keyword } = req.body;
  try {
    keyword =  encodeURIComponent(keyword);
    const rs = await axios.get(`https://www.ptt.cc/bbs/movie/search?page=1&q=${keyword}`)
    const DOM = rs.data;
    const $ = cheerio.load(DOM)
    const oldestLink = $('.btn-group-paging').find('a').attr('href');
    const maxPage = oldestLink
        .split('?')[1]
        .split('&')
        .find(item => item.includes('page'))
        .split('=')[1]
    const list = []
    const urlList = []
    for(let i=1;i<=maxPage;i++){
        urlList.push(axios.get(`https://www.ptt.cc/bbs/movie/search?page=${i}&q=${keyword}`))
    }
    Promise.all(urlList)
      .then(allRes => {
          const data = allRes.map(res => {
              const DOM = res.data
              const $ = cheerio.load(DOM)
              const items = $('.r-ent')
              return items.map((key, item) => ({
                category: $(item).find('.title').text().match(/\[(.*?)\]/g), 
                nrec: $(item).find('.nrec').text().trim(),
                title: $(item).find('.title').text().trim(),
                author: $(item).find('.author').text().trim(),
                date: $(item).find('.date').text().trim(),
                link: $(item).find('.title a').attr('href').trim(),
              })).get()
          })
          const rs = data
            .reduce((sum, elem) => sum.concat(elem), [])
            .filter(item => /雷/.test(item.title))
            .filter(item => !(/Re:/.test(item.title)))
          console.log('rs :', rs);
        res.status(200).send(rs)
      })    
  } catch (error) {
    console.error(error.message);
    next(error.message)
  }

});

module.exports = router;
