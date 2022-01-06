const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://old.aari.ru/odata/_d0015.php', {
        waitUntil: 'networkidle2',
    });
    // await page.screenshot({ path: 'example.png' });
    // await page.pdf({ path: 'hn.pdf', format: 'a4' });
    // Get the "viewport" of the page, as reported by the page.

    const years = await page.evaluate(() => {
        let totalSearchResults = Array.from(document.querySelectorAll('option[value^="20"]'));
        let totalSearchResults2 = Array.from(document.querySelectorAll('option[value^="19"]'));

        let total = [];

        totalSearchResults.forEach( i => total.push(i.value));
        totalSearchResults2.forEach( i => total.push(i.value));

        return total
    });

    for (const year of years) {
        await page.select('select', year);
        await page.waitForSelector('option[value*=".gif"]');

        const img = await page.evaluate(() => {
            let images = Array.from(document.querySelectorAll('option[value*=".gif"]'));

            let total = []

            images.forEach( i => total.push(`http://old.aari.ru/${(i.value).slice(3)}`));

            return total;
        });

        console.log(`Images`, img);
    }

    await browser.close();
})();
