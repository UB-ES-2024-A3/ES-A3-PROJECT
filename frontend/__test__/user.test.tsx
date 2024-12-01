import { By, until } from "selenium-webdriver";
import { createClient } from '@supabase/supabase-js'
import {userTest, otherUserTest, bookTest, reviewTest, supabaseResponses, createWebDriver} from "./test.utils"

// Increase Jest's default timeout to handle Selenium operations
jest.setTimeout(120000);
jest.mock('../src/contexts/TimelineContext', () => ({
  useTimelineContext: jest.fn(() => ({
    timelineState: { page: 'user', data: userTest.id },
    setTimelineState: jest.fn(),
  })),
}));


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
    //Create user for test
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
        // Navigate to page on localhost:3000/login
        await driver.get(otherUserUrl);

        try {
          let book_title = driver.wait(
            until.elementLocated(By.id(bookTest.id)), 100000
          );
          await book_title.click();
        } catch (error) {
          console.error("Error occurred:", error);
        
          // Log all IDs on the page
          let allIds = await driver.executeScript(`
            return Array.from(document.querySelectorAll('*'))
              .filter(el => el.id)
              .map(el => el.id);
          `);
          console.log("Available IDs:", allIds);
        }

        // Wait until the URL is different from the initial one
        await driver.wait(async () => {
            let currentUrl = await driver.getCurrentUrl();
            return currentUrl !== otherUserUrl;
        }, 10000);

        // Get the new URL and assert it's the profile page
        let currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toBe(bookUrl);

    } finally{
        await driver.quit();
    }


  });

});
