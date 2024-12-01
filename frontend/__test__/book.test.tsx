import { createClient } from "@supabase/supabase-js";
import { createWebDriver, bookTest, loginAsUserTest } from "./test.utils";
import { By } from "selenium-webdriver";

jest.setTimeout(30000);

let supabaseURL = process.env.SUPABASE_URL || "not_found";
let supabaseKey = process.env.SUPABASE_KEY || "not_found";

expect(supabaseURL).not.toBe("not_found")
expect(supabaseKey).not.toBe("not_found")
const supabase = createClient(supabaseURL, supabaseKey);

let baseUrl = "http://localhost:3000/";

const userTest = {
    id: "user_frontend_test_books",
    email: "fr_books_user@gmail.com",
    username: "test_user_books",
    password: "fr_password",
  };

beforeAll(async () => {
    await supabase
    .from("users")
    .insert(userTest);

    await supabase
    .from('books')
    .insert(bookTest);
});

afterAll(async () => {
    await supabase
    .from("users")
    .delete()
    .eq('id', userTest.id);

    await supabase
    .from("books")
    .delete()
    .eq('id', bookTest.id);
});

describe("Links to book page", () => {
    const timelineUrl = baseUrl + "timeline";

    test("Link from searchbar results", async () => {
        const bookPageUrl = timelineUrl + "/book/" + bookTest.id;
        const driver = await createWebDriver();
        try {
            await loginAsUserTest(driver);
            await driver.get(timelineUrl);
            // Search the test book
            await driver.findElement(By.id("searchbar-input"))
                .then(searchbar => {
                    searchbar.clear();
                    searchbar.sendKeys(bookTest.title);
                });
            // Container of the search results
            const resultsContainer = (await driver.findElement(By.id("searchbar-results"))
                .then(element => {
                    return element.findElements(By.css("div"));
                }))[0];
            // Wait for searchbar debounce
            await driver.wait(async () => {
                let results = await resultsContainer.findElements(By.css("button"));
                return results.length > 0;
            }, 1000);
            // Click the result under the searchbar
            await driver.findElement(By.id(bookTest.id))
                .then(button => {
                    button.click();
                });
            await driver.wait(async () => {
                let currentUrl = await driver.getCurrentUrl();
                return currentUrl !== timelineUrl;
            }, 10000);
            let currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toBe(bookPageUrl);
        }
        finally {
            await driver.quit();
        }
    });
    
    test("Link from search results", () => {
        
    });
    
    test("Link from profile reviews", () => {
        
    });    
});

describe.skip("Book page content", () => {
    test("Visualization of book data", () => {
        
    });
    
    test("Check book reviews", () => {
        
    });
});

describe.skip("Review creation button", () => {
    test("Open the review creation pop-up", () => {
        
    });
})
