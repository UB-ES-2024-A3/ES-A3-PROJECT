import { Builder, WebDriver } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome';


export const createWebDriver = async (): Promise<WebDriver> => {
  const options = new chrome.Options();
  options.addArguments(
    '--headless',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--enable-local-storage'
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

export const otherUserTest = {
  id: "other_user_frontend_test",
  email: "o_user@gmail.com",
  username: "other_test_user",
  password: "other_password",
};

export const bookTest = {
  id: "book_id",
  title: "title",
  author: "author",
  numreviews: 2,
  avgstars: 3
};

export const reviewTest = {
  id: "review_id",
  user_id: otherUserTest.id,
  book_id: bookTest.id,
  stars: 2,
};

export const supabaseResponses = {
    insertStatus: 201,
    insertStatusText: "Created",
    deleteStatus: 200,
    deleteStatusText: "OK",
};

