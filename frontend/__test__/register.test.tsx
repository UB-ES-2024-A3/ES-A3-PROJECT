import { By, until } from "selenium-webdriver";
import {userTest, supabaseResponses, createWebDriver} from "./test.utils"
import { createClient } from '@supabase/supabase-js'

jest.setTimeout(120000);


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

  test("Go to login Page", async () => {
    const driver = await createWebDriver();
    try{
      await driver.get(registerUrl);

      //Click register button
      let registerButton = await driver.findElement(By.id("register_go_to_login"));
      await registerButton.click();

      // Wait until the URL is different from the initial one
      await driver.wait(async () => {
          let currentUrl = await driver.getCurrentUrl();
          return currentUrl !== registerUrl;
      }, 10000);

      // Get the new URL and assert it's the profile page
      let currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toBe(loginUrl);
    }finally{
        await driver.quit();
    }

    });
    test("Check error messages for invalid inputs", async () => {
    const driver = await createWebDriver();
    try {
      await driver.get(registerUrl);

      // Test for empty fields
      let submitButton = driver.wait(
        until.elementLocated(By.id("register_button")), 100000
      );
      await submitButton.click();

      let usernameError = driver.wait(
        until.elementLocated(By.id("username-error")), 100000
      );
      let usernameErrorText = await usernameError.getText();
      expect(usernameErrorText).toBe("Username is required");

      let emailError = driver.wait(
        until.elementLocated(By.id("email-error")), 100000
      );
      let emailErrorText = await emailError.getText();
      expect(emailErrorText).toBe("Email is required");

      let pwdError = driver.wait(
        until.elementLocated(By.id("password-error")), 100000
      );
      let pwdErrorText = await pwdError.getText();
      expect(pwdErrorText).toBe("Password is required");

      let pwd2Error = driver.wait(
        until.elementLocated(By.id("password2-error")), 100000
      );
      let pwd2ErrorText = await pwd2Error.getText();
      expect(pwd2ErrorText).toBe("Repeating the password is required");

      let emailField = await driver.findElement(By.id("email"));
      await emailField.sendKeys("invalid-email"); 
      await submitButton.click();

      let incorrectEmailError = await driver.findElement(By.id("email-error"));
      let incorrectEmailErrorText = await incorrectEmailError.getText();
      expect(incorrectEmailErrorText).toBe("Email format is incorrect. Please enter a valid email address (e.g., name@company.com)");

      let passwordField = await driver.findElement(By.id("password"));
      await passwordField.sendKeys("short"); 
      await submitButton.click();

      let passwordError = await driver.findElement(By.id("password-error"));
      let passwordErrorText = await passwordError.getText();
      expect(passwordErrorText).toBe("The password must be at least 8 characters long");

      let password2Field = await driver.findElement(By.id("password2"));
      await password2Field.sendKeys("differentPassword"); 
      await submitButton.click();

      let password2Error = await driver.findElement(By.id("password2-error"));
      let password2ErrorText = await password2Error.getText();
      expect(password2ErrorText).toBe("The passwords introduced doesn't match");

    } finally {
      await driver.quit();
    }

    });
});
