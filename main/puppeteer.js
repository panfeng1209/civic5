const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const sleep = require('../help/sleep');
const {clearCookie, random} = require('../help/util');
const options = require('../help/options');
var EventEmitter = require('events').EventEmitter; 
var event = new EventEmitter(); 
event.setMaxListeners(200)
puppeteer.use(StealthPlugin());

const page = async ({ url, selector, callback }, browser) => {
  console.log('start launch puppeteer ...', url, 'callback:', !!callback, 'selector:', selector)
  const page = await browser.newPage();
  try{
    await clearCookie(browser);
    await page.goto(url, { timeout: 0, waitUntil: 'networkidle2' });
    console.log('load page down', url);
  } catch(error) {
    console.error('-------------------------------------no! error', error);
  }
  if (callback) {
    await callback({page, selector});
  }
  const randomTime = random(40, 120) * 100
  await sleep(randomTime);
  const pages = await browser.pages();
  const urls = [];
  for (let i = 1; i < pages.length; i++) {
    const page = pages[i];
    const url = page.url();
    urls.push(url)
  }
  page.close();
  event.emit('next'); 
  console.log(url, 'done~', urls.length, urls.toString(), randomTime);
}

const launch = async (lists, showX, tabs = 4) => {
  options.headless = !!showX;
  const browser = await puppeteer.launch(options);
  let init = tabs;
  event.on('next', async() => {
    init = init + 1;
    const list = lists[init];
    if (init === lists.length) {
      await sleep(10 * 1000);
      browser.close();
      console.log('~~~~~~~~~~~~~~~~~~task down~~~~~~~~~~~~~~~~~~~~~~~~~~');
    } 
    if (!!list) {
      page({...list}, browser);
    }
  }); 
  for (let i = 0; i < tabs; i++) {
    const list = lists[i];
    await sleep(1000);
    page({...list}, browser);
  }
  
}

module.exports = launch;
