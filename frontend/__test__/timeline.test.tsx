import { createClient } from "@supabase/supabase-js";
import { createWebDriver, loginAsUserTest } from "./test.utils";
import { By, until, WebElement } from "selenium-webdriver";
import { randomUUID } from "crypto";

jest.setTimeout(30000);

let supabaseURL = process.env.SUPABASE_URL || "not_found";
let supabaseKey = process.env.SUPABASE_KEY || "not_found";

expect(supabaseURL).not.toBe("not_found")
expect(supabaseKey).not.toBe("not_found")
const supabase = createClient(supabaseURL, supabaseKey);

let baseUrl = "http://localhost:3000/";
let timelineUrl = baseUrl + 'timeline';
let userPageUrl = timelineUrl + '/user/';
let bookPageUrl = timelineUrl + '/book/';

const userTest = {
    id: randomUUID(),
    username: 'tl_user_test',
    email: 'tl_u_test@gmail.com',
    password: 'testpass1!'
};

const followed = [
    {
        id: randomUUID(),
        username: 'tl_follow1_test',
        email: 'tl_f1_test@gmail.com',
        password: 'testpass'
    },
    {
        id: randomUUID(),
        username: 'tl_follow2_test',
        email: 'tl_f2_test@gmail.com',
        password: 'testpass'
    }
];

const notFollowed = {
    id: randomUUID(),
    username: 'tl_nofollow_test',
    email: 'tl_nof@gmail.com',
    password: 'testpass'
};

const books = [
    {
        id: randomUUID(),
        title: "Book 1",
        author: "Frontend, Rebook",
        description: "Test book for the frontend tests.",
        genres: "Test"
    },
    {
        id: randomUUID(),
        title: "Book 2",
        author: "Frontend, Rebook",
        description: "Test book for the frontend tests.",
        genres: "Test"
    }
];

const reviews = [
    {
        id: randomUUID(),
        user_id: followed[0].id,
        book_id: books[1].id,
        date: '2024-11-30',
        time: '11:00:00',
        stars: 4,
        comment: 'I liked it'
    },
    {
        id: randomUUID(),
        user_id: followed[1].id,
        book_id: books[0].id,
        date: '2024-12-01',
        time: '10:00:00',
        stars: 4,
        comment: 'I liked it'
    },
    {
        id: randomUUID(),
        user_id: notFollowed.id,
        book_id: books[0].id,
        date: '2024-12-01',
        time: '12:00:00',
        stars: 4,
        comment: 'I liked it'
    }
];

beforeAll(async () => {
    // add mock users
    await supabase
    .from("users")
    .insert(userTest);

    await supabase
    .from("users")
    .insert(followed);

    await supabase
    .from("users")
    .insert(notFollowed);

    // Following relationships
    await supabase
    .from("followers")
    .insert([
        {follower_id: userTest.id, followed_id: followed[0].id},
        {follower_id: userTest.id, followed_id: followed[1].id}
    ]);

    // add mock books
    await supabase
    .from("books")
    .insert(books);

    // add mock reviews
    await supabase
    .from("reviews")
    .insert(reviews);
});

afterAll(async () => {
    // delete mock reviews
    await supabase
    .from("reviews")
    .delete()
    .in('id', [reviews[0].id, reviews[1].id, reviews[2].id]);

    // delete mock books
    await supabase
    .from("books")
    .delete()
    .in('id', [books[0].id, books[1].id]);

    // Following relationships
    await supabase
    .from("followers")
    .delete()
    .eq('follower_id', userTest.id);

    // delete mock users
    await supabase
    .from("users")
    .delete()
    .in('id', [userTest.id, followed[0].id, followed[1].id, notFollowed.id]);
});

describe("Review Buttons", () => {
    test("Go to user page", async () => {
        const driver = await createWebDriver();
        try{
            await driver.get(baseUrl + '/profile');
            await driver.executeScript(`
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userId', '${userTest.id}');
            `);
            await driver.get(timelineUrl);
            await driver.wait(until.elementsLocated(By.className('usernameButton')), 10000, "Waiting for timeline to load");
            // Click first button
            await driver.findElements(By.className("usernameButton"))
            .then(buttons => {
                buttons[0].click();
            });
            // Wait until the page changes.
            await driver.wait(until.urlContains(userPageUrl), 10000, "Waiting for page to change");
            let currentUrl = await driver.getCurrentUrl();
            // Topmost review should be tl_follow2_test's
            expect(currentUrl).toBe(userPageUrl + followed[1].id)
        } finally {
        await driver.quit();
        }
    });

    test("Go to book page", async () => {
        const driver = await createWebDriver();
        try{
            await driver.get(baseUrl + '/profile');
            await driver.executeScript(`
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userId', '${userTest.id}');
            `);
            await driver.get(timelineUrl);
            await driver.wait(until.elementsLocated(By.className('titleButton')), 10000, "Waiting for timeline to load");
            // Click first button
            await driver.findElements(By.className("titleButton"))
            .then(buttons => {
                buttons[0].click();
            });
            // Wait until the page changes.
            await driver.wait(until.urlContains(bookPageUrl), 10000, "Waiting for page to change");
            let currentUrl = await driver.getCurrentUrl();
            // Topmost review should be tl_follow2_test's
            expect(currentUrl).toBe(bookPageUrl + books[0].id)
        } finally {
        await driver.quit();
        }
    });
});

describe("Timeline users", () => {
    test("Only followed users", async () => {
        const driver = await createWebDriver();
        try{
            await driver.get(baseUrl + '/profile');
            await driver.executeScript(`
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userId', '${userTest.id}');
            `);
            await driver.get(timelineUrl);
            await driver.wait(until.elementsLocated(By.className('usernameButton')), 10000, "Waiting for timeline to load");
            await driver.findElements(By.className("usernameButton"))
            .then(buttons => {
                buttons.forEach(async button => {
                    expect(await button.getText()).not.toBe(notFollowed.username);
                });
            });
        } finally {
        await driver.quit();
        }
    });
});