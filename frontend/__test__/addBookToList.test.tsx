import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome';
import { createClient } from '@supabase/supabase-js'
import {supabaseResponses, createWebDriver, loginAsUserTest} from "./test.utils";

// Increase Jest's default timeout to handle Selenium operations
jest.setTimeout(60000);

let supabaseURL = process.env.SUPABASE_URL || "not_found";
let supabaseKey = process.env.SUPABASE_KEY || "not_found";

expect(supabaseURL).not.toBe("not_found")
expect(supabaseKey).not.toBe("not_found")
const supabase = createClient(supabaseURL, supabaseKey);

let baseUrl = "http://localhost:3000/";

const userAddBookTest = {
    id: "user_add_book_test",
    email: "test_book_list@gmail.com",
    username: "test_book_list",
    password: "book_list_pwd",
};

const listAddBookTest1 = {
    id: "list1_add_book_test",
    name: "list1",
    user_id: userAddBookTest.id,
};

const listAddBookTest2 = {
    id: "list2_add_book_test",
    name: "list2",
    user_id: userAddBookTest.id,
};

const bookAddBookTest = {
    id: "book_add_book_test",
    title: "Roger the galactic rabbit",
    author: "Edmure of Tarly",
    description: "The adventures of a rabbit in the galaxy.",
    genres: "Fiction",
};

const bookListRelationAddBookTest = {
    id: "relation_add_book_test",
    list_id: listAddBookTest1.id,
    book_id: bookAddBookTest.id,
};

beforeAll(async () => {
    //Create user for test
    const messageUser = await supabase
    .from('users')
    .insert(userAddBookTest)
    expect(messageUser["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageUser["statusText"]).toBe(supabaseResponses.insertStatusText)

    const messageList1 = await supabase
    .from('book_lists')
    .insert(listAddBookTest1)
    expect(messageList1["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageList1["statusText"]).toBe(supabaseResponses.insertStatusText)

    const messageList2 = await supabase
    .from('book_lists')
    .insert(listAddBookTest2)
    expect(messageList2["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageList2["statusText"]).toBe(supabaseResponses.insertStatusText)

    const messageBook = await supabase
    .from('books')
    .insert(bookAddBookTest)
    expect(messageBook["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageBook["statusText"]).toBe(supabaseResponses.insertStatusText)
});

afterAll(async () => {
    //Delete book from lists even if the test fails
    const messageDeleteBookList1 = await supabase
    .from('list_book_relationships')
    .delete()
    .eq('book_id', bookAddBookTest.id)
    .eq('list_id', listAddBookTest1.id)

    const messageDeleteBookList2 = await supabase
    .from('list_book_relationships')
    .delete()
    .eq('book_id', bookAddBookTest.id)
    .eq('list_id', listAddBookTest2.id)

    const messageBook = await supabase
    .from('books')
    .delete()
    .eq('id', bookAddBookTest.id)
    .select()
    expect(messageBook["status"]).toBe(supabaseResponses.deleteStatus)
    expect(messageBook["statusText"]).toBe(supabaseResponses.deleteStatusText)

    const messageList1 = await supabase
    .from('book_lists')
    .delete()
    .eq('id', listAddBookTest1.id)
    .select()
    expect(messageList1["status"]).toBe(supabaseResponses.deleteStatus)
    expect(messageList1["statusText"]).toBe(supabaseResponses.deleteStatusText)

    const messageList2 = await supabase
    .from('book_lists')
    .delete()
    .eq('id', listAddBookTest2.id)
    .select()
    expect(messageList2["status"]).toBe(supabaseResponses.deleteStatus)
    expect(messageList2["statusText"]).toBe(supabaseResponses.deleteStatusText)

    const messageUser = await supabase
    .from('users')
    .delete()
    .eq('id', userAddBookTest.id)
    .select()
    expect(messageUser["status"]).toBe(supabaseResponses.deleteStatus)
    expect(messageUser["statusText"]).toBe(supabaseResponses.deleteStatusText)

});

describe("Test list creation", () => {
    const bookUrl = baseUrl + 'timeline/book/' + bookAddBookTest.id

    test("Check correct list creation", async () => {
        const driver = await createWebDriver();
        await driver.manage().setTimeouts({ implicit: 15000 });

        //Add test book to testList1
        const messageAddBookList = await supabase
        .from('list_book_relationships')
        .insert(bookListRelationAddBookTest)
        expect(messageAddBookList["status"]).toBe(supabaseResponses.insertStatus)
        expect(messageAddBookList["statusText"]).toBe(supabaseResponses.insertStatusText)

        try {
            //Login with user
            await loginAsUserTest(driver, userAddBookTest);

            //Go to the desired book page
            await driver.get(bookUrl);

            //Wait until new page loads
            await driver.sleep(10000);

            //Open pop-up
            let addListsBtn = await driver.findElement(By.id('add-to-lists-btn'));
            await addListsBtn.click();

            //Check that the correct checkboxes are selected
            let checkBoxList1 = await driver.findElement(By.id(listAddBookTest1.id));
            let checkBoxList2 = await driver.findElement(By.id(listAddBookTest2.id));
            let isList1Checked = await checkBoxList1.isSelected();
            let isList2Checked = await checkBoxList2.isSelected();
            expect(isList1Checked).toBe(true);
            expect(isList2Checked).toBe(false);

            //Now we check that the book is correctly added and deleted from lists
            //and that the checkboxs are shown accordingly
            await checkBoxList1.click();
            await checkBoxList2.click();
            let acceptButton = await driver.findElement(By.id('update-lists-btn'));
            await acceptButton.click();
            await driver.sleep(15000);


            addListsBtn = await driver.findElement(By.id('add-to-lists-btn'));
            await addListsBtn.click();

            checkBoxList1 = await driver.findElement(By.id(listAddBookTest1.id));
            checkBoxList2 = await driver.findElement(By.id(listAddBookTest2.id));
            isList1Checked = await checkBoxList1.isSelected();
            isList2Checked = await checkBoxList2.isSelected();
            expect(isList1Checked).toBe(false);
            expect(isList2Checked).toBe(true);

            let message = await supabase
            .from('list_book_relationships')
            .select()
            .eq('list_id', listAddBookTest2.id)
            .eq('book_id', bookAddBookTest.id)
            expect(message["status"]).toBe(supabaseResponses.fetchStatus)
            expect(message["statusText"]).toBe(supabaseResponses.fetchStatusText)

            message = await supabase
            .from('list_book_relationships')
            .select()
            .eq('list_id', listAddBookTest1.id)
            .eq('book_id', bookAddBookTest.id)
            expect(message["status"]).toBe(supabaseResponses.fetchStatus);
            expect(message["statusText"]).toBe(supabaseResponses.fetchStatusText);

        }
        finally{
            await driver.quit();
        }
    });

});
