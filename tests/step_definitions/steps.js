const { I } = inject();
// Add in your custom step files

Given(/^я нахожусь на странице "(.*?)"$/, (page) => {
  I.amOnPage(page);
});

When('я ввожу {string} в поле {string}', (value,fieldName) => {
  I.fillField(fieldName,value);
});

When('я нажимаю на кнопку {string}', (button) => {
  I.click(button);
});

Then('я вижу текст {string}', (text) => {
  I.see(text);
});

