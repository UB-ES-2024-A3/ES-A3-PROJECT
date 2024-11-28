import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome';

// Increase Jest's default timeout to handle Selenium operations
jest.setTimeout(30000);

describe("Button Text Test", () => {
  let driver: WebDriver;

  beforeAll(async () => {
    // Microsoft uses a longer name for Edge
    const options = new chrome.Options();
    options.addArguments(
        '--headless',          // Run in headless mode
        '--no-sandbox',        // Required for some CI environments
        '--disable-dev-shm-usage', // Prevent crashes in resource-limited environments
        '--disable-gpu',       // Disable GPU rendering for better compatibility
        '--window-size=1920,1080' // Set window size for consistent viewport
  );

    const host = 'selenium';
    driver = await new Builder()
        .forBrowser('chrome').setChromeOptions(options)
        .build()
  });

  afterAll(async () => {
    // Quit the WebDriver instance
    if(driver){
            await driver.quit();
        }
  });

  test("checks if the button contains the correct text", async () => {
    // Navigate to your page on localhost:3000
    await driver.get("http://127.0.0.1:3000/login");

    // Find the button element by its ID
    const button = await driver.findElement(By.id("login_go_to_register"));

    // Wait until the button is visible and accessible
    await driver.wait(until.elementIsVisible(button), 5000);

    // Get the text of the button
    const buttonText = await button.getText();

    // Assert that the button's text is what you expect
    expect(buttonText).toBe("Don't have an account? Register");
  });
});
