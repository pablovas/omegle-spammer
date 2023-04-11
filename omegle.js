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

  console.log('Initiating process...');
  bot.sendAnimation(myChatId, 'https://media4.giphy.com/media/6pUjuQQX9kEfSe604w/giphy.gif?cid=ecf05e47aokiybnwwcb9r9fvsqg58y0xwaztfennjib0d42e&rid=giphy.gif&ct=g', {caption: 'Iniciando rotina...'});

  await page.goto('https://www.omegle.com/');
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
    const data = new Date();
    const horas = data.getHours();
    const minutos = data.getMinutes();

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
          console.log(`It is ${horas} hours and ${minutos} minutes. Waiting for 30 min to dont get captcha!`);
          function loadingAnimation() {
            let i = 0;
            const animationInterval = setInterval(() => {
              const progressBar = `[${'='.repeat(i)}${' '.repeat(52 - i)}]`;
              process.stdout.write(`\r${progressBar}`);
              i = (i + 1) % 53;
            }, 100);
            return () => {
              clearInterval(animationInterval);
              process.stdout.write(`\r[${'='.repeat(52)}]\n`);
            };
          }
          const stopLoadingAnimation = loadingAnimation();
          setTimeout(() => {
            stopLoadingAnimation();
            console.log('Carregamento completo!');
          }, 1800000);  
          bot.sendMessage(myChatId, `🚨🚨🚨Pausando por 30 min, para evitar captchas.🚨🚨🚨`);
          await page.waitForTimeout(1800000);
          count = 0;
          console.log(`It is ${horas} hours and ${minutos} minutes., starting again...`);
          bot.sendMessage(myChatId, `🔰Retomando envio de mensagens.🔰`);
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
          console.log('Captcha is visible in browser, shuting down...');
          bot.sendMessage(myChatId, 'Captcha encontrado! Finalizando serviço.');
          await browser.close();
        }
      }

    } else {
      console.log('Bonk! Textarea element not found.', ` It is ${horas} hours and ${minutos} minutes.`);
      bot.sendAnimation(myChatId, 'https://media.giphy.com/media/TC8AiZrjV2Qo0/giphy.gif', {caption: 'O bot está sendo desligado. 💤'});
      await browser.close();
    }

    //  Verify which hours are to shutdown the browser
    if (horas === 00 && minutos >= 30) {
      console.log(` It is time to shutdown, it is ${horas} hours and ${minutos} minutes.`);
      bot.sendAnimation(myChatId, 'https://media.giphy.com/media/TC8AiZrjV2Qo0/giphy.gif', {caption: 'O bot está sendo desligado. 💤'});
      await browser.close();
    }

    await page.waitForTimeout(1000);
  }
})();