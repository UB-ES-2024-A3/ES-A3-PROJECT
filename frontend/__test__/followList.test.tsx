import { By, until } from "selenium-webdriver";
import { createClient } from '@supabase/supabase-js'
import { createWebDriver } from "./test.utils";
import { randomUUID } from "crypto";

// Increase Jest's default timeout to handle Selenium operations
jest.setTimeout(70000);

let supabaseURL = process.env.SUPABASE_URL || "not_found";
let supabaseKey = process.env.SUPABASE_KEY || "not_found";

expect(supabaseURL).not.toBe("not_found")
expect(supabaseKey).not.toBe("not_found")
const supabase = createClient(supabaseURL, supabaseKey);

let baseUrl = "http://localhost:3000/";
let baseListUrl = baseUrl + 'timeline/list/';
let baseOwnListUrl = baseUrl + 'profile/list/';

// Test data to use 
const testusers = [
    {
        id: randomUUID(),
        email: 'testlistfollower@ex.com',
        username: 'testlistfollower',
        password: 'testpassword'
    },
    {
        id: randomUUID(),
        email: 'testfollowlistowner@ex.com',
        username: 'testfollowlistowner',
        password: 'testpassword'
    }
];
const testuserId = testusers[0].id;
const listownerId = testusers[1].id;

const followedlistName = 'followedlist';
const unfollowedlistName = 'unfollowedlist';
const ownlistName = 'testuserownlist'
const testlists = [
    {
        id: randomUUID(),
        user_id: listownerId,
        name: followedlistName
    },
    {
        id: randomUUID(),
        user_id: listownerId,
        name: unfollowedlistName
    },
    {
        id: randomUUID(),
        user_id: testuserId,
        name: ownlistName
    }
];
const followedlistId = testlists[0].id;
const unfollowedlistId = testlists[1].id;
const ownlistId = testlists[2].id;

const followdata = {
    id: randomUUID(),
    user_id: testuserId,
    list_id: followedlistId
};

beforeAll(async () => {
    await supabase
    .from('users')
    .insert(testusers);

    await supabase
    .from('book_lists')
    .insert(testlists);

    await supabase
    .from('followers_list')
    .insert(followdata);
});

afterAll(async() => {
    await supabase
    .from('followers_list')
    .delete()
    .eq('user_id', testuserId);

    await supabase
    .from('book_lists')
    .delete()
    .in('id', [followedlistId, unfollowedlistId, ownlistId]);

    await supabase
    .from('users')
    .delete()
    .in('id', [testuserId, listownerId]);
});

let followedlistUrl = baseListUrl + `${followedlistId}?name=${followedlistName}`;
let unfollowedlistUrl = baseListUrl + `${unfollowedlistId}?name=${unfollowedlistName}`;
let ownListUrl = baseOwnListUrl + `${ownlistId}?name=${ownlistName}`;

describe('Test follow list button', () => {
     test('Test follow and unfollow list', async () => {
        const driver = await createWebDriver();
        try {
            await driver.get(baseListUrl);
            await driver.executeScript(`
                localStorage.setItem('isAuthenticated', 'true')
                localStorage.setItem('userId', '${testuserId}')
            `);
            await driver.get(unfollowedlistUrl);
            const followBtn = await driver.findElement(By.id('follow-list-btn'));
            await driver.wait(until.elementIsEnabled(followBtn), 5000, "Timeout for follow button to be enabled");
            await followBtn.getText()
            .then(buttonText => {
                expect(buttonText).toBe("Follow list");
            });
            await followBtn.click();
            await driver.wait(until.elementIsEnabled(followBtn), 5000, "Timeout for following list after clicking the button");
            await followBtn.getText()
            .then(buttonText => {
                expect(buttonText).toBe("Unfollow list");
            });
            await followBtn.click();
            await driver.wait(until.elementIsEnabled(followBtn), 5000, "Timeout for unfollowing list after clicking the button");
            await followBtn.getText()
            .then(buttonText => {
                expect(buttonText).toBe("Follow list");
            });
        }
        finally {
            driver.quit();
        }
     });

     test('Check correct text in followed lists', async () => {
        const driver = await createWebDriver();
        try {
            await driver.get(baseListUrl);
            await driver.executeScript(`
                localStorage.setItem('isAuthenticated', 'true')
                localStorage.setItem('userId', '${testuserId}')
            `);
            await driver.get(followedlistUrl);
            const followBtn = await driver.findElement(By.id('follow-list-btn'));
            await driver.wait(until.elementIsEnabled(followBtn), 5000, "Timeout for follow button to be enabled");
            await followBtn.getText()
            .then(buttonText => {
                expect(buttonText).toBe("Unfollow list");
            });
        }
        finally {
            driver.quit();
        }
     });

     test('Check no button in own list', async () => {
        const driver = await createWebDriver();
        try {
            await driver.get(baseListUrl);
            await driver.executeScript(`
                localStorage.setItem('isAuthenticated', 'true')
                localStorage.setItem('userId', '${testuserId}')
            `);
            await driver.get(ownListUrl);
            await driver.findElements(By.id('follow-list-btn'))
            .then(buttons => {
                expect(buttons.length).toBe(0);
            });
        }
        finally {
            driver.quit();
        }
     })
});
