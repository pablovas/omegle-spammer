//CODE MADE WITH LOVE BY @guaxinin and @al_interpol
const { chromium } = require('playwright');
const TelegramBot = require('node-telegram-bot-api');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const bot = new TelegramBot('YOUR_BOT_TOKEN');
  const myChatId = 'YOUR_CHAT_ID';

  let count = 0;
  // Get the current date and time
  const now = new Date();

  // Get the current hour and minute
  const hour = now.getHours();
  const minute = now.getMinutes();

  await page.goto('https://www.omegle.com/');
  console.log('Initiating process...');
  bot.sendAnimation(myChatId, 'https://media4.giphy.com/media/6pUjuQQX9kEfSe604w/giphy.gif?cid=ecf05e47aokiybnwwcb9r9fvsqg58y0xwaztfennjib0d42e&rid=giphy.gif&ct=g', {caption: 'Iniciando rotina...'});

  await page.waitForSelector('#textbtn');
  await page.waitForTimeout(1500);

  // Click the text-only chat button
  await page.click('#textbtn');

  //Check the first checkbox
  const firstCheck = await page.$('label strong');
  if (firstCheck) {
    await page.waitForTimeout(500);
    await firstCheck.click();
  }

  //Check the second checkbox
  const ndCheck = await page.$("//label[contains(., 'By checking the box you acknowledge that you have reviewed and agree to be bound by ')]");
  if (ndCheck) {
    await page.waitForTimeout(1000);
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
        await page.waitForTimeout(500);
        await textArea.press('Enter');
        console.log('Sent message');
        await page.keyboard.press('Escape');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(5000);
        count++;

        if (count === 60) {
          console.log('Waiting for 15 min to dont get captcha. Agora são ', hour,':',minute);
          bot.sendMessage(myChatId, '🚨🚨🚨Pausando por 15 min, para evitar captchas.🚨🚨🚨');
          await page.waitForTimeout(900000);
          count = 0;
          console.log('Starting again... Agora são ', hour,':',minute);
          bot.sendMessage(myChatId, '🔰Retomando envio de mensagens.🔰');
          await page.keyboard.press('Escape');

        }
        console.log('Starting a new chat number ', count);
      
      } else {
        // If textarea is not enabled, start another chat
        console.log('Textarea element is disabled. Starting a new chat...');
        await page.keyboard.press('Escape');
      }

      // Verify if captcha is really in the screen to close service or not
      const captchaSelector = '[title="reCAPTCHA"]';
      const captcha = await page.$(captchaSelector);
      if (captcha) {
        const captchaIsVisible = await captcha.isVisible();
        if (captchaIsVisible) {
          console.log('Captcha está visível na página');
          bot.sendMessage(myChatId, 'Captcha encontrado! Finalizando serviço.');
          await browser.close();
        }
      }

    } else {
      console.log('Bonk! Textarea element not found.');
      bot.sendAnimation(myChatId, 'https://media.giphy.com/media/TC8AiZrjV2Qo0/giphy.gif', {caption: 'O bot está sendo desligado. 💤'});
      await browser.close();
    }

    // Check if the current time is between 1:00 am and 2:30 am
    if (hour === 1 && minute >= 0 || hour === 2 && minute <= 30) {
      // If it is, send a message and close the browser
      bot.sendAnimation(myChatId, 'https://media.giphy.com/media/TC8AiZrjV2Qo0/giphy.gif', {caption: 'O bot está sendo desligado. 💤'});
      await browser.close();
    }
    await page.waitForTimeout(1000);
  }
})();