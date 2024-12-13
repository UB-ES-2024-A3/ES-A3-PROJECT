import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome';
import { createClient } from '@supabase/supabase-js'
import {supabaseResponses, createWebDriver, loginAsUserTest} from "./test.utils";

// Increase Jest's default timeout to handle Selenium operations
jest.setTimeout(40000);

let supabaseURL = process.env.SUPABASE_URL || "not_found";
let supabaseKey = process.env.SUPABASE_KEY || "not_found";

expect(supabaseURL).not.toBe("not_found")
expect(supabaseKey).not.toBe("not_found")
const supabase = createClient(supabaseURL, supabaseKey);

let baseUrl = "http://localhost:3000/";

const userListTest = {
    id: "user_create_list_test",
    email: "test_list@gmail.com",
    username: "test_list",
    password: "test_list_pwd",
};


const list1name = "list1";
const list2 = {
    id: "list2_id",
    name: "list2",
    user_id: userListTest.id,
};

beforeAll(async () => {
    //Create user for test
    const messageUser = await supabase
    .from('users')
    .insert({id: userListTest.id, email: userListTest.email, password: userListTest.password, username: userListTest.username})
    expect(messageUser["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageUser["statusText"]).toBe(supabaseResponses.insertStatusText)

    const messageList = await supabase
    .from('book_lists')
    .insert({id: list2.id, name: list2.name, user_id: list2.user_id})
    expect(messageList["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageList["statusText"]).toBe(supabaseResponses.insertStatusText)
});

afterAll(async () => {
    //Delete list
    const messageList = await supabase
    .from('book_lists')
    .delete()
    .eq('id', list2.id)
    .select()
    expect(messageList["status"]).toBe(supabaseResponses.deleteStatus)
    expect(messageList["statusText"]).toBe(supabaseResponses.deleteStatusText)

    // Delete user
    const messageUser = await supabase
    .from('users')
    .delete()
    .eq('id', userListTest.id)
    .select()
    expect(messageUser["status"]).toBe(supabaseResponses.deleteStatus)
    expect(messageUser["statusText"]).toBe(supabaseResponses.deleteStatusText)

});

describe("Test list creation", () => {
    const profile = baseUrl + 'profile'

    test("Check correct list creation", async () => {
        const driver = await createWebDriver();
        try {
            await loginAsUserTest(driver, userListTest);
            // Enter the lists section
            let listsTab = await driver.findElement(By.id('profile-created-lists-tab'));
            await listsTab.click();

            //Open create list pop-up
            let createListBtn = await driver.findElement(By.id("create-list-btn"));
            await createListBtn.click();

            //Enter the list name
            let listNameTextArea = await driver.findElement(By.id('list-name-textarea'));
            await listNameTextArea.sendKeys(list1name);

            //Press the post up button
            let postButton = await driver.findElement(By.id("post-list-btn"));
            await postButton.click();

            await driver.sleep(5000);

            const messageList = await supabase
            .from('book_lists')
            .delete()
            .eq('user_id', userListTest.id)
            .eq('name', list1name)
            .select();
            expect(messageList["status"]).toBe(supabaseResponses.deleteStatus)
            expect(messageList["statusText"]).toBe(supabaseResponses.deleteStatusText)

        }
        finally{
            await driver.quit();
        }
    });


    test("Check list creation with repeated name and void name", async () => {
        const driver = await createWebDriver();
        await driver.manage().setTimeouts({ implicit: 5000 });
        try {
            await loginAsUserTest(driver, userListTest);
            // Enter the lists section
            let listsTab = await driver.findElement(By.id('profile-created-lists-tab'));
            await listsTab.click();

            //Open create list pop-up
            let createListBtn = await driver.findElement(By.id("create-list-btn"));
            await createListBtn.click();

            //Press the post up button with void text
            let postButton = await driver.findElement(By.id("post-list-btn"));
            await postButton.click();

            //Get and check errorMessage
            let errorMessage = await driver.findElement(By.id("createlist-errorMessage"));
            let errorMessageText = await errorMessage.getText();
            expect(errorMessageText).toBe("The list name cannot be empty");

            //Close the pop-up
            let cancelButton = await driver.findElement(By.id("cancel-btn"));
            await cancelButton.click();

            //Now, we repeat the process but with an existing name
            createListBtn = await driver.findElement(By.id("create-list-btn"));
            await createListBtn.click();

            //Enter the list name
            let listNameTextArea = await driver.findElement(By.id('list-name-textarea'));
            await listNameTextArea.sendKeys(list2.name);

            postButton = await driver.findElement(By.id("post-list-btn"));
            await postButton.click();

            errorMessage = await driver.findElement(By.id("createlist-errorMessage"));
            errorMessageText = await errorMessage.getText();
            expect(errorMessageText).toBe("A list with this name already exists");

        }
        finally{
            await driver.quit();
        }
    });
});
