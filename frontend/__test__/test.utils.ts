import { Builder, WebDriver } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome';


export const createWebDriver = async (): Promise<WebDriver> => {
  const options = new chrome.Options();
  options.addArguments(
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

