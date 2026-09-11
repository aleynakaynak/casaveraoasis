import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1440, height: 1024 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.goto('https://www.casaveraoasis.com/catalog.html', {
      waitUntil: 'networkidle0',
      timeout: 45000
    });
    await page.emulateMediaType('screen');

    const pdf = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Casa-Vera-Oasis-Katalog.pdf"');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    res.status(200).send(Buffer.from(pdf));
  } catch (error) {
    console.error('catalog-pdf error', error);
    res.status(500).send('Katalog PDF hazırlanamadı.');
  } finally {
    if (browser) await browser.close();
  }
}
