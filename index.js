const puppeteer = require('puppeteer');
const username = "DBLFloatGaming";
const password = "Ty4zxcF99";

let browser = null;
let page = null;

// VIEWPORT SETTINGS
const vpWidth = 1280;
const vpHeight = 800;

//twitter stuff
let searchBar = 'input[data-testid="SearchBox_Search_Input"]';
let hashtag = '#gamedev';
let targetProfileCSS = 'a.css-4rbku5.css-18t94o4.css-1dbjc4n.r-sdzlij.r-1loqt21.r-1adg3ll.r-ahm1il.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg.r-13qz1uu';
let followButtonCSS = 'div[class="css-18t94o4 css-1dbjc4n r-1niwhzg r-p1n3y5 r-sdzlij r-1phboty r-rs99b7 r-1w2pmg r-1vuscfd r-1dhvaqw r-1ny4l3l r-1fneopy r-o7ynqc r-6416eg r-lrvibr"]';
let tweet = 'bruh, i need some gamer juice right now.';
(async() => {
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    page.setViewport({
        width: vpWidth,
        height: vpHeight,
        isMobile: false
    });

    //log the bot in
    await page.goto('https://twitter.com/login', {waitUntil: 'networkidle2'});
    await page.type('input[name="session[username_or_email]"]', username, {delay: 25});
    await page.type('input[name="session[password]"]', password, {delay: 25});
    await page.click('div[data-testid="LoginForm_Login_Button"]');

//CURRENTLY NOT WORKING

    /* //find tweet box
    await page.waitFor('div[class="notranslate public-DraftEditor-content"]', {delay: 25});
    //write tweet
    await page.type('div[class="notranslate public-DraftEditor-content"]', tweet, {delay: 25});
    //submit tweet
    await page.keyboard.press('Control' + 'Enter'); */
    

    //find the search bar, enter hashtag and search
    await page.waitFor(searchBar);
    await page.type(searchBar, hashtag, {delay:25});
    await page.keyboard.press('Enter');

    //finding content (users)
    let contentSet = new Set();
    try {
        let prevHeight;
        //while items.length < itemTargetCount
        for(let i = 0; i < 5; i++){
            //find the user
            const elementHandles = await page.$$(targetProfileCSS);
            const propertyJsHandles = await Promise.all(elementHandles.map(handle => handle.getProperty('href')));
            const urls = await Promise.all(propertyJsHandles.map(handle => handle.jsonValue()));

            urls.forEach(item => contentSet.add(item));
            console.log(urls);

            //get viewport height
            prevHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            //scroll to bounds of previous height
            await page.waitForFunction(`document.body.scrollHeight > ${prevHeight} `);
            await page.waitFor(200);

        }
    } catch(e) {console.log(e);}

    const urls = Array.from(contentSet);

    //for each user we find, go to their page and click follow
    for (let i = 0; i < urls.length; i++) {
        try{
            const url = urls[i];
            await page.goto(`${url}`);
            await page.waitFor(2000);
            await page.click(followButtonCSS);
            await page.waitFor(2000);
            await page.goBack();
        } catch(e) {
            console.error(e);
        }
    }
})();