const puppy = require('puppeteer');


let page1 ;
let page2 ;
let browser;
async function launchTab1(){
    browser =  await puppy.launch({
        headless : false,
        defaultViewport : null,
        args:[
             '--start-maximized'
         ]
    }); 
   
    let currentPages = await browser.pages();
    page1 = currentPages[0];
    await page1.setDefaultNavigationTimeout(0);
    await page1.goto("https://www.365chess.com/play_computer_online.php");
    
    await page1.waitForSelector("input[class = 'button']");
    await page1.click("input[class = 'button']");
    await page1.waitFor(1000);
    const color = await page1.$("#color_opt_2");
    await color.click();
    await page1.waitForSelector("input[value = 'Play']");
    await page1.click("input[value = 'Play']");
    await launchTab2();
}

async function launchTab2(){
    
    page2 = await browser.newPage();
    await page2.setDefaultNavigationTimeout(0);
    await page2.goto("https://www.365chess.com/play_computer_online.php");

    await page2.waitForSelector("input[class = 'button']");
    await page2.click("input[class = 'button']");
    await page2. waitFor(1000);
    
    await page2.waitForSelector("input[value = 'Play']");
    await page2.click("input[value = 'Play']");
    await tab1Play(null,null);
}

async function tab1Play(from2, to2){
    await page1.bringToFront(); 
    if(from2 != null && to2!=null){
        await page1.waitForSelector("div[data-square = "+from2+"]");
        await page1.waitForSelector("div[data-square = "+to2+"]");
        
        await dragAndDrop("div[data-square = "+from2+"]" , "div[data-square = "+to2+"]" , page1);
        await page1.click("div[data-square = "+to2+"]");
    }
    await page1.waitFor(5*1000);
    const element1 = await page1.waitForSelector(".currMove");
    let to1 = await page1.evaluate(element => element.textContent, element1);
    if(to1.length !=2 ) to1 = to1.substring(to1.length-2);
    console.log(to1);
    
    await page1.waitForSelector(".highlight1-32417");
    await page1.$$(".highlight1-32417");
    await page1.waitFor(1000);
    
    let from1 = await page1.$eval(".highlight1-32417", element=>element.getAttribute("data-square"));
    if(from1.length != 2 ) from1 = from1.substring(from1.length - 2);
    console.log(from1);
    await tab2Play(from1, to1);
}

async function dragAndDrop(source, target, page) {
    await page.evaluate((source, target) => {
      source = document.querySelector(source);
  
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("mousedown", true, true, null);
      event.clientX = source.getBoundingClientRect().top;
      event.clientY = source.getBoundingClientRect().left;
      source.dispatchEvent(event);
  
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("dragstart", true, true, null);
      event.clientX = source.getBoundingClientRect().top;
      event.clientY = source.getBoundingClientRect().left;
      source.dispatchEvent(event);
  
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("drag", true, true, null);
      event.clientX = source.getBoundingClientRect().top;
      event.clientY = source.getBoundingClientRect().left;
      source.dispatchEvent(event);
  
  
      target = document.querySelector(target);
  
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("dragover", true, true, null);
      event.clientX = target.getBoundingClientRect().top;
      event.clientY = target.getBoundingClientRect().left;
      target.dispatchEvent(event);
  
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("drop", true, true, null);
      event.clientX = target.getBoundingClientRect().top;
      event.clientY = target.getBoundingClientRect().left;
      target.dispatchEvent(event);
  
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("dragend", true, true, null);
      event.clientX = target.getBoundingClientRect().top;
      event.clientY = target.getBoundingClientRect().left;
      target.dispatchEvent(event);
    }, source, target);
    
  };
  
  
async function tab2Play(from1, to1){
    await page2.waitFor(1000);
    await page2.bringToFront();
    await page2.waitFor(1000);

    
    await page2.waitForSelector("div[data-square = "+from1+"]");
    await page2.waitForSelector("div[data-square = "+to1+"]");
    
    await dragAndDrop("div[data-square = "+from1+"]" , "div[data-square = "+to1+"]" , page2);
    await page2.click("div[data-square = "+to1+"]");
    
    await page2.waitFor(5*1000);
    const element2 = await page2.$(".currMove") ; 
    let to2 = (await page2.evaluate(element => element.textContent, element2));
    if(to2.length !=2 ) to2 = to2.substring(to2.length-2);
    console.log(to2);
    await page2.waitFor(1000); 
    
    await page1.waitForSelector(".highlight1-32417");
    await page2.$(".highlight1-32417");
    await page2.waitFor(1000);
    let from2 = await page2.$eval(".highlight1-32417", element=> element.getAttribute("data-square"));
    if(from2.length != 2 ) from2 = from2.substring(from2.length-2);
    console.log(from2);
    await tab1Play(from2, to2);
}


launchTab1(); 