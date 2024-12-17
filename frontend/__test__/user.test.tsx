import { By, until } from "selenium-webdriver";
import { createClient } from '@supabase/supabase-js'
import {userTest, otherUserTest, bookTest, reviewTest, supabaseResponses, createWebDriver} from "./test.utils"

jest.setTimeout(120000);

describe("Button Text Test", () => {
  let supabaseURL = process.env.SUPABASE_URL;
  let supabaseKey = process.env.SUPABASE_KEY;
  supabaseURL ??= "not_found";
  supabaseKey ??= "not_found";
  expect(supabaseURL).not.toBe("not_found")
  expect(supabaseKey).not.toBe("not_found")
  const supabase = createClient(supabaseURL, supabaseKey);

  let baseUrl = "http://localhost:3000/"
  let otherUserUrl = baseUrl+ "timeline/user/" + otherUserTest.id
  let bookUrl = baseUrl+ "timeline/book/" + bookTest.id
  let profileUrl = baseUrl+ "profile"

  beforeAll(async () => {
    let message = await supabase
    .from('users')
    .insert({id: userTest.id, email: userTest.email, password: userTest.password, username: userTest.username});

    expect(message["status"]).toBe(supabaseResponses.insertStatus)
    expect(message["statusText"]).toBe(supabaseResponses.insertStatusText)

    message = await supabase
    .from('users')
    .insert({id: otherUserTest.id, email: otherUserTest.email, password: otherUserTest.password, username: otherUserTest.username});

    expect(message["status"]).toBe(supabaseResponses.insertStatus)
    expect(message["statusText"]).toBe(supabaseResponses.insertStatusText)

    message = await supabase
    .from('books')
    .insert({id: bookTest.id,
      title: bookTest.title,
      author: bookTest.author,
      numreviews: bookTest.numreviews,
      avgstars: bookTest.avgstars});

    expect(message["status"]).toBe(supabaseResponses.insertStatus)
    expect(message["statusText"]).toBe(supabaseResponses.insertStatusText)

    message = await supabase
    .from('reviews')
    .insert({id: reviewTest.id,
      user_id: reviewTest.user_id,
      book_id: reviewTest.book_id,
      stars: reviewTest.stars});

    expect(message["status"]).toBe(supabaseResponses.insertStatus)
    expect(message["statusText"]).toBe(supabaseResponses.insertStatusText)
  });

  afterAll(async () => {
    let message = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewTest.id)
    .select()
    
    expect(message["status"]).toBe(supabaseResponses.deleteStatus)
    expect(message["statusText"]).toBe(supabaseResponses.deleteStatusText)

    message = await supabase
    .from('users')
    .delete()
    .eq('id', userTest.id)
    .select()

    expect(message["status"]).toBe(supabaseResponses.deleteStatus)
    expect(message["statusText"]).toBe(supabaseResponses.deleteStatusText)

    message = await supabase
    .from('users')
    .delete()
    .eq('id', otherUserTest.id)
    .select()

    expect(message["status"]).toBe(supabaseResponses.deleteStatus)
    expect(message["statusText"]).toBe(supabaseResponses.deleteStatusText)

    message = await supabase
    .from('books')
    .delete()
    .eq('id', bookTest.id)
    .select()
    
    expect(message["status"]).toBe(supabaseResponses.deleteStatus)
    expect(message["statusText"]).toBe(supabaseResponses.deleteStatusText)
  });

  test("Check go to book page", async () => {

    const driver = await createWebDriver();
    try{
        await driver.get(profileUrl);
        await driver.executeScript(`
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userId', '${userTest.id}');
        `);

        await driver.get(otherUserUrl);

        
        let book_title = driver.wait(
          until.elementLocated(By.id(bookTest.id)), 120000
        );

        await book_title.click();
        
        await driver.wait(async () => {
            let currentUrl = await driver.getCurrentUrl();
            return currentUrl !== otherUserUrl;
        }, 10000);

        let currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(bookUrl);

    } finally{
        await driver.quit();
    }
  });
  
  test("Follow/Unfollow user", async () => {

    const driver = await createWebDriver();
    try{
        await driver.get(profileUrl);
        await driver.executeScript(`
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userId', '${userTest.id}');
        `);

        await driver.get(otherUserUrl);

        
        let follow_button = driver.wait(
          until.elementLocated(By.id("follow")), 120000
        );

        let followButtonText = await follow_button.getText(); 
        await follow_button.click();
        await driver.wait(async () => {
          let currentFollowButtonText = await follow_button.getText(); 
          return currentFollowButtonText !== followButtonText;
        }, 100000);
        followButtonText = await follow_button.getText(); 

        expect(followButtonText).toBe("Unfollow");

        await follow_button.click();
        await driver.wait(async () => {
          let currentFollowButtonText = await follow_button.getText(); 
          return currentFollowButtonText !== followButtonText;
        }, 1000000);
        followButtonText = await follow_button.getText(); 
        expect(followButtonText).toBe("Follow");

    } finally{
        await driver.quit();
    }
  });
  test("Check go to followed lists", async () => {

    const driver = await createWebDriver();
    try{
        await driver.get(profileUrl);
        await driver.executeScript(`
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userId', '${userTest.id}');
        `);
        
        let followed_lists_tab = driver.wait(
          until.elementLocated(By.id("profile-followed-lists-tab")), 120000
        );

        await followed_lists_tab.click();

        let followed_no_lists_message = driver.wait(
            until.elementLocated(By.id("followed_no_lists_message")), 120000
          );
          let messageText = followed_no_lists_message.getText();

          messageText.then((text) => {
            expect(text).toEqual("No lists followed.");
          });

    } finally{
        await driver.quit();
    }
  });
});
