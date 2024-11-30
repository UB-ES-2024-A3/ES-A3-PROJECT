import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome';
import { createClient } from '@supabase/supabase-js'
import {userTest, supabaseResponses, createWebDriver} from "./test.utils"

// Increase Jest's default timeout to handle Selenium operations
jest.setTimeout(30000);


describe("Button Text Test", () => {
  let supabaseURL = process.env.SUPABASE_URL;
  let supabaseKey = process.env.SUPABASE_KEY;
  supabaseURL ??= "not_found";
  supabaseKey ??= "not_found";
  expect(supabaseURL).not.toBe("not_found")
  expect(supabaseKey).not.toBe("not_found")
  const supabase = createClient(supabaseURL, supabaseKey);

  let baseUrl = "http://localhost:3000/"
  let loginUrl = baseUrl+"login";
  let registerUrl = baseUrl+"register"
  let profileUrl = baseUrl+"profile"

  beforeAll(async () => {
    //Create user for test
    const message = await supabase
    .from('users')
    .insert({id: userTest.id, email: userTest.email, password: userTest.password, username: userTest.username});

    expect(message["status"]).toBe(supabaseResponses.insertStatus)
    expect(message["statusText"]).toBe(supabaseResponses.insertStatusText)
  });

  afterAll(async () => {
    // Delete user
    const message = await supabase
    .from('users')
    .delete()
    .eq('id', userTest.id)
    .select()

    expect(message["status"]).toBe(supabaseResponses.deleteStatus)
    expect(message["statusText"]).toBe(supabaseResponses.deleteStatusText)

  });


  test("Check correct login and logout", async () => {

    const driver = await createWebDriver();
    try{
        // Navigate to page on localhost:3000/login
        await driver.get(loginUrl);

        //Input email
        let inputName = await driver.findElement(By.id("username"));
        await inputName.clear();
        await inputName.sendKeys(userTest.email);

        //Input password
        let inputPwd = await driver.findElement(By.id("password"));
        await inputPwd.clear();
        await inputPwd.sendKeys(userTest.password);

        //Click login button
        let loginButton = await driver.findElement(By.id("login_button"));
        await loginButton.click();

        // Wait until the URL is different from the initial one
        await driver.wait(async () => {
            let currentUrl = await driver.getCurrentUrl();
            return currentUrl !== loginUrl;
        }, 10000);

        // Get the new URL and assert it's the profile page
        let currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(profileUrl);

        //Click logout button
        let logoutButton = await driver.findElement(By.id("logout_button"));
        await logoutButton.click();

        // Wait until the URL is different from the initial one
        await driver.wait(async () => {
            let currentUrl = await driver.getCurrentUrl();
            return currentUrl !== profileUrl;
        }, 10000);

        currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(loginUrl)

    } finally{
        await driver.quit();
    }


  });

  test("Check go to register", async () => {

    const driver = await createWebDriver();
    try{
        await driver.get(loginUrl);

        //Click register button
        let registerButton = await driver.findElement(By.id("login_go_to_register"));
        await registerButton.click();

        // Wait until the URL is different from the initial one
        await driver.wait(async () => {
            let currentUrl = await driver.getCurrentUrl();
            return currentUrl !== loginUrl;
        }, 10000);

        // Get the new URL and assert it's the profile page
        let currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(registerUrl);
    }finally{
        await driver.quit();
    }

  });

});
