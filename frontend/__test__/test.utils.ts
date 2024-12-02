import { randomUUID } from "crypto";
import { Builder, By, WebDriver } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome';


export const createWebDriver = async (): Promise<WebDriver> => {
  const options = new chrome.Options();
  options.addArguments(
    '--headless',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  );

  return await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
};


export const userTest = {
  id: "user_frontend_test",
  email: "fr_user@gmail.com",
  username: "test_user",
  password: "fr_password",
};

export const supabaseResponses = {
    insertStatus: 201,
    insertStatusText: "Created",
    deleteStatus: 200,
    deleteStatusText: "OK",
};

export const loginAsUserTest = async (driver: WebDriver, user: {username: string, password: string}) => {
  const loginUrl = "http://localhost:3000/login";
  // Navigate to page on localhost:3000/login
  await driver.get(loginUrl);

  //Input email
  await driver.findElement(By.id("username"))
    .then(inputName => {
      inputName.clear();
      inputName.sendKeys(user.username);
    });

  //Input password
  await driver.findElement(By.id("password"))
    .then(inputPwd => {
      inputPwd.clear();
      inputPwd.sendKeys(user.password);
    });

  //Click login button
  await driver.findElement(By.id("login_button"))
    .then(loginButton => {
      loginButton.click();
    });

  // Wait until the URL is different from the initial one
  await driver.wait(async () => {
      let currentUrl = await driver.getCurrentUrl();
      return currentUrl !== loginUrl;
  }, 10000);
}
