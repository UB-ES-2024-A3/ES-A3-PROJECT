import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome';
import { createClient } from '@supabase/supabase-js'
import {supabaseResponses, createWebDriver, loginAsUserTest} from "./test.utils";

// Increase Jest's default timeout to handle Selenium operations
jest.setTimeout(30000);

let supabaseURL = process.env.SUPABASE_URL || "not_found";
let supabaseKey = process.env.SUPABASE_KEY || "not_found";

expect(supabaseURL).not.toBe("not_found")
expect(supabaseKey).not.toBe("not_found")
const supabase = createClient(supabaseURL, supabaseKey);

let baseUrl = "http://localhost:3000/";

const userTest = {
    id: "user_frontend_test_searching",
    email: "fr_searching@gmail.com",
    username: "test_searching",
    password: "fr_password",
}
const searchedUserTest = {
    id: "e2e27e12-1602-4347-8ce0-0a5043d5a3b4",
    email: "fr_search_user@gmail.com",
    username: "test_usrsearch",
    password: "fr_password",
};

beforeAll(async () => {
    //Create user for test
    const message = await supabase
    .from('users')
    .insert({id: userTest.id, email: userTest.email, password: userTest.password, username: userTest.username});
    expect(message["status"]).toBe(supabaseResponses.insertStatus)
    expect(message["statusText"]).toBe(supabaseResponses.insertStatusText)

    //Create user to search it
    const message2 = await supabase
    .from('users')
    .insert({id: searchedUserTest.id, email: searchedUserTest.email, password: searchedUserTest.password, username: searchedUserTest.username});
    expect(message2["status"]).toBe(supabaseResponses.insertStatus)
    expect(message2["statusText"]).toBe(supabaseResponses.insertStatusText)
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

    const message2 = await supabase
    .from('users')
    .delete()
    .eq('id', searchedUserTest.id)
    .select()
    expect(message2["status"]).toBe(supabaseResponses.deleteStatus)
    expect(message2["statusText"]).toBe(supabaseResponses.deleteStatusText)    
});

// Testejar si al buscar un user apareix el user a la barra de navegació
// Al clicar Search, a la llista de users apareix allà també. Mirar que s'ha canviat la pàg.

//No sé si arribar fins a clicar a l'usuari i que el porti a la pàgina de user.


describe("Search bar for users", () => {
    const timelineUrl = baseUrl + 'timeline';

    test("Check user in search bar", async () => {
        const driver = await createWebDriver();
        try {
            await loginAsUserTest(driver, userTest);
            await driver.get(timelineUrl);
            // Search the test user
            await driver.findElement(By.id("searchbar-input"))
                .then(searchbar => {
                    searchbar.clear();
                    searchbar.sendKeys(searchedUserTest.username);
                });
            // Container of the search results
            const resultsContainer = await driver.findElement(By.id("searchbar-results"));
            // Wait for searchbar debounce
            await driver.wait(async () => {
                let results = await resultsContainer.findElements(By.css("button"));
                return results.length > 0;
            }, 5000, 'Debounce timeout');

            // Search the result under the searchbar
            await driver.findElement(By.id(searchedUserTest.id))
                .getText()
                .then(username => {
                    expect(username).toBe(searchedUserTest.username);
                });

            // Now test that the page of the user opens.
        }
        finally{
            await driver.quit();
        }
    });

    test("Check user in list of users", async () => {
        const driver = await createWebDriver();
        try {
            await loginAsUserTest(driver, userTest);
            await driver.get(timelineUrl);
            // Search the test user
            await driver.findElement(By.id("searchbar-input"))
                .then(searchbar => {
                    searchbar.clear();
                    searchbar.sendKeys(searchedUserTest.username);
                });

            await driver.findElement(By.id("searchbar-button"))
                .then(button => {
                    button.click();
                });
            // Wait for search result page
            await driver.wait(async () => {
                let currentUrl = await driver.getCurrentUrl();
                return currentUrl !== timelineUrl;
            }, 10000);

            // Test that the URL is the expected
            let searchUrl = await driver.getCurrentUrl();
            expect(searchUrl).toBe(timelineUrl+'/search/'+searchedUserTest.username);
            
            await driver.findElement(By.id('search-users-tab'))
                .then(button => {
                    button.click();
                });

            // Container of the search results
            const resultsContainer = await driver.wait(until.elementLocated(By.id("list-results")), 5000);
            // Wait for searchbar debounce
            await driver.wait(async () => {
                let results = await resultsContainer.findElements(By.css("button"));
                return results.length > 0;
            }, 5000, 'Debounce timeout');

            await driver.findElement(By.id(searchedUserTest.id))
                .getText()
                .then(username => {
                    expect(username).toBe(searchedUserTest.username);
                });

            // Now test that the page of the user opens.
        }
        finally{
            await driver.quit();
        }
  });
});