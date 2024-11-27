import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome"; // Import Chrome options

// Increase Jest's default timeout to handle Selenium operations
jest.setTimeout(30000);

describe("Button Text Test", () => {
  let driver: WebDriver;

  beforeAll(async () => {

    // Create Chrome options
    const chromeOptions = new chrome.Options().addArguments(
      "--disable-gpu",
      "--headless",
      "--no-sandbox",
      "--disable-dev-shm-usage"
    );
    const service = new chrome.ServiceBuilder("/path/to/chromedriver");
    // Create a new WebDriver instance for Chrome
    driver = await new Builder().forBrowser("chrome").build().setChromeOptions(chromeOptions);
  });

  afterAll(async () => {
    // Quit the WebDriver instance
    await driver.quit();
  });

  test("checks if the button contains the correct text", async () => {
    // Navigate to your page on localhost:3000
    await driver.get("http://localhost:3000/login");

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
