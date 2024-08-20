const puppeteer = require('puppeteer');

const URL = 'https://stackoverflow.com/questions';

const singlePageScraper = async () => {
    console.log('Opening the browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log(`Navigating to ${URL}...`);
    await page.goto(URL, { waitUntil: 'load' });

    console.log(`Collecting the questions...`);
    const questions = await page.evaluate(() => {
        return [...document.querySelectorAll('.question-summary')]
        .map((question) => {
            return {
            question: question.querySelector('.question-hyperlink').innerText,
            excerpt: question.querySelector('.excerpt').innerText,
            };
        });
    });

    console.log('Closing the browser...');

    await page.close();
    await browser.close();

    console.log('Job done!');
    console.log(questions);
    return questions;
};

const multiPageScraper = async (pages = 1) => {
    console.log('Opening the browser...');
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--single-process",
            "--no-zygote",
            "--disable-accelerated-2d-canvas",
            "--disable-gpu",
          ]
    });
    const page = await browser.newPage();

    console.log(`Navigating to ${URL}...`);
    await page.goto(URL, { waitUntil: 'load' });

    const totalPages = pages;
    let questions = [];

    for (let initialPage = 1; initialPage <= totalPages; initialPage++) {
        console.log(`Collecting the questions of page ${initialPage}...`);
        let pageQuestions = await page.evaluate(() => {
        return [...document.querySelectorAll('.s-post-summary')]
            .map((question) => {
            return {
                question: question.querySelector('.s-link').innerText,
                excerpt: question.querySelector('.s-post-summary--content-excerpt').innerText,
            }
            });
        });

        questions = questions.concat(pageQuestions);
        console.log(questions);
    // Go to next page until the total number of pages to scrap is reached
        if (initialPage < totalPages) {
        await Promise.all([
            await page.click('.pager > a:last-child'),
            await page.waitForSelector('.s-post-summary'),
        ])
        }
    }

    console.log('Closing the browser...');

    await page.close();
    await browser.close();

    console.log('Job done!');
    return questions;
};

module.exports = {
    singlePageScraper,
    multiPageScraper,
};