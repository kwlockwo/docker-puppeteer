const puppeteer = require('puppeteer');

const URL = 'https://google.com';

const screenshot = async () => {
  console.log('Opening the browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log(`Go to ${URL}`);
  await page.goto(URL);

  console.log('Taking a screenshot...');
  await page.screenshot({
    path: './screenshot.png',
    fullPage: true,
  });

  console.log('Closing the browser...');
  await page.close();
  await browser.close();
  console.log('Job done!');
};

screenshot();