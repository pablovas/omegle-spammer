//CODE MADE WITH LOVE BY @guaxinin and @al_interpol
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.omegle.com/');
  await page.waitForSelector('#textbtn');

  // Click the text-only chat button
  await page.click('#textbtn');

  //Check the first checkbox
  const firstCheck = await page.$('label strong');
  if (firstCheck) {
    await firstCheck.click();
  }

  //Check the second checkbox
  const ndCheck = await page.$("//label[contains(., 'By checking the box you acknowledge that you have reviewed and agree to be bound by ')]");
  if (ndCheck) {
    await ndCheck.click();
  }

  //Delay to see if the checkbox is checked
  await page.waitForTimeout(2000);

  //Click on confirm button
  await page.click('input[type="button"]');

  //Verify if textarea exist and start loop
  while (true) {
    const textArea = await page.$('textarea.chatmsg');

    if (textArea) {
      const isEnabled = await textArea.isEnabled();
      
      if (isEnabled) {
        // Type into the textarea and send the message
        await textArea.type('Your message');
        await textArea.press('Enter');
        console.log('Sent message');
        await page.waitForTimeout(2000);
        // Press the Esc key two times to go out of the chat
        await page.keyboard.press('Escape');
        await page.keyboard.press('Escape');
        console.log('Starting a new chat');
      
      } else {
        //if textarea is not enabled, start another chat
        console.log('Textarea element is disabled. Starting a new chat...');
        await page.keyboard.press('Escape');
      }
    
    } else {
      console.log('Bonk! Textarea element not found.');
    }
    
    await page.waitForTimeout(1000);
  }
})();