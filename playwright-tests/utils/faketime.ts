import type { Page } from "@playwright/test";

export const setFakeDateTime = async (page: Page, fakeDateTime: string) => {
  // mock date
  const fakeNow = new Date(fakeDateTime).valueOf();

  // Update the Date accordingly in your test pages
  await page.addInitScript(`{
     // Extend Date constructor to default to fakeNow
     Date = class extends Date {
       constructor(...args) {
         if (args.length === 0) {
           super(${fakeNow});
         } else {
           super(...args);
         }
       }
     }
     // Override Date.now() to start from fakeNow
     const __DateNowOffset = ${fakeNow} - Date.now();
     const __DateNow = Date.now;
     Date.now = () => __DateNow() + __DateNowOffset;
     }`);
};
