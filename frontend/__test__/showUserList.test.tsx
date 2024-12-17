import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from 'selenium-webdriver/chrome';
import { createClient } from '@supabase/supabase-js'
import {supabaseResponses, createWebDriver, loginAsUserTest} from "./test.utils";

// Increase Jest's default timeout to handle Selenium operations
jest.setTimeout(70000);

let supabaseURL = process.env.SUPABASE_URL || "not_found";
let supabaseKey = process.env.SUPABASE_KEY || "not_found";

expect(supabaseURL).not.toBe("not_found")
expect(supabaseKey).not.toBe("not_found")
const supabase = createClient(supabaseURL, supabaseKey);

let baseUrl = "http://localhost:3000/";

const userShowList = {
    id: "user_show_list",
    email: "test_show_list_@gmail.com",
    username: "test_show_list",
    password: "show_list_pwd",
};

const listShowList1 = {
    id: "list1_show_list",
    name: "Medicine",
    user_id: userShowList.id,
};

const listShowList2 = {
    id: "list2_show_list",
    name: "Mathematics",
    user_id: userShowList.id,
};

const bookShowList1 = {
    id: "book_show_list_1",
    title: "How to blow your nose (according to science)",
    author: "Dr. Mucus",
    description: "In this book we discuss the different approaches that have been studied for emptying the nasal cavity in humans.",
    genres: "Fiction",
};

const bookShowList2 = {
    id: "book_show_list_2",
    title: "The scary truth behind hygienic paper (not good for your popo)",
    author: "Dr. Shitus",
    description: "It is better to user water and soap.",
    genres: "Fiction",
};

const relationShowList1 = {
    id: "relation_1",
    list_id: listShowList1.id,
    book_id: bookShowList1.id,
};

const relationShowList2 = {
    id: "relation_2",
    list_id: listShowList1.id,
    book_id: bookShowList2.id,
};

beforeAll(async () => {
    //Create user for test
    const messageUser = await supabase
    .from('users')
    .insert(userShowList)
    expect(messageUser["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageUser["statusText"]).toBe(supabaseResponses.insertStatusText)

    const messageList1 = await supabase
    .from('book_lists')
    .insert(listShowList1)
    expect(messageList1["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageList1["statusText"]).toBe(supabaseResponses.insertStatusText)

    const messageList2 = await supabase
    .from('book_lists')
    .insert(listShowList2)
    expect(messageList2["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageList2["statusText"]).toBe(supabaseResponses.insertStatusText)

    const messageBook1 = await supabase
    .from('books')
    .insert(bookShowList1)
    expect(messageBook1["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageBook1["statusText"]).toBe(supabaseResponses.insertStatusText)

    const messageBook2 = await supabase
    .from('books')
    .insert(bookShowList2)
    expect(messageBook2["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageBook2["statusText"]).toBe(supabaseResponses.insertStatusText)

    const messageRelation1 = await supabase
    .from('list_book_relationships')
    .insert(relationShowList1)
    expect(messageRelation1["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageRelation1["statusText"]).toBe(supabaseResponses.insertStatusText)

    const messageRelation2 = await supabase
    .from('list_book_relationships')
    .insert(relationShowList2)
    expect(messageRelation2["status"]).toBe(supabaseResponses.insertStatus)
    expect(messageRelation2["statusText"]).toBe(supabaseResponses.insertStatusText)
});

afterAll(async () => {
    const messageRelation1 = await supabase
    .from('list_book_relationships')
    .delete()
    .eq('id', relationShowList1.id)
    expect(messageRelation1["status"]).toBe(204)
    expect(messageRelation1["statusText"]).toBe("No Content")

    const messageRelation2 = await supabase
    .from('list_book_relationships')
    .delete()
    .eq('id', relationShowList2.id)
    expect(messageRelation2["status"]).toBe(204)
    expect(messageRelation2["statusText"]).toBe("No Content")

    const messageBook1 = await supabase
    .from('books')
    .delete()
    .eq('id', bookShowList1.id)
    .select()
    expect(messageBook1["status"]).toBe(supabaseResponses.deleteStatus)
    expect(messageBook1["statusText"]).toBe(supabaseResponses.deleteStatusText)

    const messageBook2 = await supabase
    .from('books')
    .delete()
    .eq('id', bookShowList2.id)
    .select()
    expect(messageBook2["status"]).toBe(supabaseResponses.deleteStatus)
    expect(messageBook2["statusText"]).toBe(supabaseResponses.deleteStatusText)

    const messageList1 = await supabase
    .from('book_lists')
    .delete()
    .eq('id', listShowList1.id)
    .select()
    expect(messageList1["status"]).toBe(supabaseResponses.deleteStatus)
    expect(messageList1["statusText"]).toBe(supabaseResponses.deleteStatusText)

    const messageList2 = await supabase
    .from('book_lists')
    .delete()
    .eq('id', listShowList2.id)
    .select()
    expect(messageList2["status"]).toBe(supabaseResponses.deleteStatus)
    expect(messageList2["statusText"]).toBe(supabaseResponses.deleteStatusText)

    const messageUser = await supabase
    .from('users')
    .delete()
    .eq('id', userShowList.id)
    .select()
    expect(messageUser["status"]).toBe(supabaseResponses.deleteStatus)
    expect(messageUser["statusText"]).toBe(supabaseResponses.deleteStatusText)

});

describe("Test list creation", () => {
    const profileUrl = baseUrl+"profile";
    const list1Url = profileUrl+"/list/"+listShowList1.id+"?name="+listShowList1.name;
    const book1Url = baseUrl+"timeline/book/"+bookShowList1.id;


    test("Check list creation with repeated name and void name", async () => {
        const driver = await createWebDriver();
        await driver.manage().setTimeouts({ implicit: 5000 });
        try {
            await loginAsUserTest(driver, userShowList);
            // Enter the lists section
            let listsTab = await driver.findElement(By.id('profile-created-lists-tab'));
            await listsTab.click();

            //Check the existence of buttons
            let list1Btn = await driver.findElement(By.id(listShowList1.id));
            let list2Btn = await driver.findElement(By.id(listShowList2.id));

            //Go to the list1 page by clicking on button
            await list1Btn.click();
            let currentUrl = await driver.getCurrentUrl();
            await driver.wait(async () => {
                currentUrl = await driver.getCurrentUrl();
                return currentUrl !== profileUrl;
            }, 10000);
            expect(currentUrl).toBe(list1Url);

            //Check for the existence of the two books in the list
            let book1Btn = await driver.findElement(By.id(bookShowList1.id));
            let book2Btn = await driver.findElement(By.id(bookShowList2.id));

            //Go to one of the book pages by clicking on the button
            await book1Btn.click();
            await driver.wait(async () => {
                currentUrl = await driver.getCurrentUrl();
                return currentUrl !== list1Url;
            }, 10000);
            expect(currentUrl).toBe(book1Url)

        }
        finally{
            await driver.quit();
        }
    });

});
