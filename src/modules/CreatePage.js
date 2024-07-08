export default async function CreatePage(browser, options) {

  const page = await browser.newPage();

  await page.setRequestInterception(true);

  const { method, headers, body } = options;

  page.on('request', interceptedRequest => {
    const overrides = {
      method,
      headers,
      postData: body
    };
    interceptedRequest.continue(overrides);
  });

  return page;
}
