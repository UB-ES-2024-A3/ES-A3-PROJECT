import { createClient } from "@supabase/supabase-js";
import { createWebDriver, loginAsUserTest } from "./test.utils";
import { By, until, WebElement } from "selenium-webdriver";

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

const bookTest = {
    id: "frontend-test-book",
    title: "Frontend Test Book",
    author: "Frontend, Rebook",
    description: "Test book for the frontend tests.",
    genres: "Test"
};

const reviewTest = {
    id: "frontend-book-review-test",
    user_id: "user_frontend_test_books",
    book_id: 'frontend-test-book',
    date: '2024-11-30',
    time: '11:00:00',
    stars: 4,
    comment: 'I liked it'
};

beforeAll(async () => {
    await supabase
    .from("users")
    .insert(userTest);

    await supabase
    .from('books')
    .insert(bookTest);

    await supabase
    .from('reviews')
    .insert(reviewTest);
});

afterAll(async () => {
    await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewTest.id);

    await supabase
    .from("users")
    .delete()
    .eq('id', userTest.id);

    await supabase
    .from("books")
    .delete()
    .eq('id', bookTest.id);
});

const timelineUrl = baseUrl + "timeline";
const bookPageUrl = timelineUrl + "/book/" + bookTest.id;
describe("Links to book page", () => {

    test("Link from searchbar results", async () => {
        const driver = await createWebDriver();
        try {
            await loginAsUserTest(driver, userTest);
            await driver.get(timelineUrl);
            // Search the test book
            await driver.findElement(By.id("searchbar-input"))
                .then(searchbar => {
                    searchbar.clear();
                    searchbar.sendKeys(bookTest.title);
                });
            // Container of the search results
            const resultsContainer = await driver.findElement(By.id("searchbar-results"));
            // Wait for searchbar debounce
            await driver.wait(async () => {
                let results = await resultsContainer.findElements(By.css("button"));
                return results.length > 0;
            }, 5000);
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
    
    test("Link from search results", async () => {
        const driver = await createWebDriver();
        try {
            await loginAsUserTest(driver, userTest);
            await driver.get(timelineUrl);
            // Search the test book
            await driver.findElement(By.id("searchbar-input"))
                .then(searchbar => {
                    searchbar.clear();
                    searchbar.sendKeys(bookTest.title);
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
            let searchUrl = await driver.getCurrentUrl();
            await driver.findElement(By.id('search-books-tab'))
                .then(button => {
                    button.click();
                });
            await driver.wait(async() => {
                const buttons = await driver.findElements(By.id(bookTest.id));
                return buttons.length > 0;
            }, 5000);
            // Click the result
            await driver.findElement(By.id(bookTest.id))
                .then(button => {
                    button.click();
                });
            await driver.wait(async () => {
                let currentUrl = await driver.getCurrentUrl();
                return currentUrl !== searchUrl;
            }, 10000);
            let currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toBe(bookPageUrl);
        }
        finally {
            await driver.quit();
        }
    });
    
    test("Link from profile reviews", async () => {
        const driver = await createWebDriver();
        try {
            await loginAsUserTest(driver, userTest);
            await driver.get(baseUrl + 'profile');
            let reviewList: WebElement[] = [];
            await driver.wait(async () => {
                reviewList = await driver.findElements(By.className("titleButton"));
                return reviewList.length > 0;
            }, 5000, 'Could not load reviews');
            // There is only one review
            await reviewList[0].click();
            await driver.wait(async () => {
                let currentUrl = await driver.getCurrentUrl();
                return currentUrl !== baseUrl + "profile";
            }, 10000, 'Does not route to book page');
            let currentUrl = await driver.getCurrentUrl();
            expect(currentUrl).toBe(bookPageUrl);
        }
        finally {
            await driver.quit();
        }
    });    
});

describe("Book page content", () => {
    test("Visualization of book data", async () => {
        const driver = await createWebDriver();
        try {
            await loginAsUserTest(driver, userTest);
            await driver.get(timelineUrl);
            // Search the test book
            await driver.findElement(By.id("searchbar-input"))
                .then(searchbar => {
                    searchbar.clear();
                    searchbar.sendKeys(bookTest.title);
                });
                const resultsContainer = await driver.findElement(By.id("searchbar-results"));
                // Wait for searchbar debounce
                await driver.wait(async () => {
                    let results = await resultsContainer.findElements(By.css("button"));
                    return results.length > 0;
                }, 5000, 'Debounce timeout');
                // Click the result under the searchbar
                await driver.findElement(By.id(bookTest.id))
                    .then(button => {
                        button.click();
                    });
                // Wait for search result page
            await driver.wait(async () => {
                let currentUrl = await driver.getCurrentUrl();
                return currentUrl !== timelineUrl;
            }, 10000, 'Does not route to book page');
            await driver.sleep(1000);
            await driver.findElement(By.id("book-title"))
                .getText()
                .then(title => {
                    expect(title).toBe(bookTest.title);
                });
            await driver.findElement(By.id("book-author"))
                .getText()
                .then(author => {
                    expect(author).toBe(bookTest.author);
                });
            await driver.findElement(By.id("book-description"))
                .getText()
                .then(description => {
                    expect(description).toBe(bookTest.description);
                });
            await driver.findElement(By.id("book-genres"))
                .findElements(By.css("span"))
                .then(genres => {
                    expect(genres.length).toBe(1);
                    return genres[0].getText();
                })
                .then(genre => {
                    expect(genre).toBe(bookTest.genres);
                });
        }
        finally {
            await driver.quit();
        }
    });
    
    test("Check book reviews", async () => {
        const driver = await createWebDriver();
        try {
            await loginAsUserTest(driver, userTest);
            await driver.get(timelineUrl);
            // Search the test book
            await driver.findElement(By.id("searchbar-input"))
                .then(searchbar => {
                    searchbar.clear();
                    searchbar.sendKeys(bookTest.title);
                });
                const resultsContainer = await driver.findElement(By.id("searchbar-results"));
                // Wait for searchbar debounce
                await driver.wait(async () => {
                    let results = await resultsContainer.findElements(By.css("button"));
                    return results.length > 0;
                }, 5000, 'Debounce timeout');
                // Click the result under the searchbar
                await driver.findElement(By.id(bookTest.id))
                    .then(button => {
                        button.click();
                    });
                // Wait for search result page
            await driver.wait(async () => {
                let currentUrl = await driver.getCurrentUrl();
                return currentUrl !== timelineUrl;
            }, 10000, 'Does not route to book page');
            await driver.sleep(2000);
            await driver.wait(until.elementsLocated(By.className("review-card")), 5000);
            const review = await driver.findElements(By.className("review-card"))
                .then(reviews => {
                    expect(reviews.length).toBe(1);
                    return reviews[0];
                });
            await review.findElement(By.css("h2"))
                .getText()
                .then(username => {
                    expect(username).toBe(userTest.username);
                });
        }
        finally {
            await driver.quit();
        }
    });
});

describe("Review creation button", () => {
    test("Open the review creation pop-up", async () => {
        const driver = await createWebDriver();
        try {
            await loginAsUserTest(driver, userTest);
            await driver.get(bookPageUrl);
            await driver.findElement(By.id("add-review-btn"))
                .then(button => {
                    button.click();
                });
            await driver.sleep(500);
            const popup = await driver.findElements(By.id("add-review-popup"))
                .then(found => {
                    expect(found.length).toBe(1);
                    return found[0];
                });
            // Check the "done" button is disabled
            await popup.findElement(By.id("post-review-btn"))
                .then(button => {
                    return button.isEnabled();
                })
                .then(isEnabled => {
                    expect(isEnabled).toBeFalsy();
                });
            // Check the "done" button is enabled after setting a rating
            await popup.findElement(By.id("rating-btns"))
                .findElements(By.css("button"))
                .then(buttons => {
                    buttons[2].click();
                });
            await popup.findElement(By.id("post-review-btn"))
                .then(button => {
                    return button.isEnabled();
                })
                .then(isEnabled => {
                    expect(isEnabled).toBeTruthy();
                });
            // Close popup
            await popup.findElement(By.id("cancel-review-btn"))
                .then(button => {
                    button.click();
                });
            await driver.sleep(500);
            await driver.findElements(By.id("add-review-popup"))
                .then(popups => {
                    expect(popups.length).toBe(0);
                });
        }
        finally {
            await driver.quit();
        }
    });
})
