const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  
  const pagesToTest = [
    '/', '/noticia.html', '/equipo1.html', '/noticias.html', 
    '/plantilla.html', '/patrocinadores.html', '/contacto.html', '/admin.html'
  ];

  for (const pagePath of pagesToTest) {
    const page = await browser.newPage();
    const url = 'http://localhost:8080' + pagePath;
    
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    console.log(`\nTesting ${url}...`);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      
      // Basic SEO checks
      const hasMain = await page.evaluate(() => !!document.querySelector('main'));
      const hasTitle = await page.evaluate(() => !!document.title);
      const hasH1 = await page.evaluate(() => !!document.querySelector('h1'));
      
      console.log(`- <main> present: ${hasMain}`);
      console.log(`- <title> present: ${hasTitle}`);
      console.log(`- <h1> present: ${hasH1}`);
      
      if (errors.length > 0) {
        console.log(`- Console errors found: ${errors.length}`);
        errors.forEach(e => console.log(`  * ${e}`));
      } else {
        console.log(`- No console errors (CSP and JS valid)`);
      }

      // Check specific functionality if it's the index
      if (pagePath === '/') {
        // Toggle dark mode
        await page.click('#theme-toggle');
        const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        console.log(`- Dark mode toggled: ${isDark ? 'ON' : 'OFF'}`);

        // Toggle language ES/EU
        await page.click('#lang-toggle');
        // Let's assume clicking EU sets lang to 'eu'
        await page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('[data-lang]')).find(e => e.getAttribute('data-lang')==='eu');
            if(btn) btn.click();
        });
        const lang = await page.evaluate(() => document.documentElement.lang);
        console.log(`- Language toggled, current <html lang="">: ${lang}`);
      }

    } catch(e) {
      console.log(`- Failed to load or test: ${e.message}`);
    }
    
    await page.close();
  }
  
  await browser.close();
})();
