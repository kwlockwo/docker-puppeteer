const express = require('express');
const scraper = require('../lib/scraper');

const router = express.Router();

router.get('/', async (req, res, next) => {
  // 1. Get the parameter "pages"
  const { pages } = req.query;
  // 2. Call the scraper function
  const questions = await scraper.multiPageScraper(pages);
  // 3. Return the array of questions to the client
  res.status(200).json({
    statusCode: 200,
    message: 'Questions correctly retrieved',
    data: { questions },
  });
});

module.exports = router;