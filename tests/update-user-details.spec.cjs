import { test, expect } from "@playwright/test";

test.describe.serial("Serial tests for shared account", () => {
  test("Changing User's Password", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByPlaceholder("Enter Your Email ").fill("1234@Email.com");
    await page.getByPlaceholder("Enter Your Password").click();
    await page.getByPlaceholder("Enter Your Password").fill("TestTest123123");
    await page.waitForTimeout(2000);
    await page.locator('button[type="submit"].btn-primary').click();
    await page.locator('a[role="button"].nav-link.dropdown-toggle').click();
    await page.waitForSelector('a.dropdown-item[href="/dashboard/user"]');
    await page.getByRole("link", { name: "Dashboard" }).click();
    await page.waitForSelector(
      'a.list-group-item.list-group-item-action[href="/dashboard/user/profile"]'
    );
    await page.getByRole("link", { name: "Profile" }).click();
    await page.fill('input[placeholder="Enter Your Password"]', "");
    await page.getByRole("button", { name: "UPDATE" }).click();
    await expect(
      page.locator("text=Profile Updated Successfully")
    ).toBeVisible();
    await page.getByRole("link", { name: "Home" }).click();
    await page.locator('a[role="button"].nav-link.dropdown-toggle').click();
    await page.waitForSelector('a.dropdown-item[href="/dashboard/user"]');
    await page.getByRole("link", { name: "Logout" }).click();

    //login with new password
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByPlaceholder("Enter Your Email ").fill("1234@Email.com");
    await page.getByPlaceholder("Enter Your Password").click();
    await page.getByPlaceholder("Enter Your Password").fill("TestTest123123");
    await page.getByRole("button", { name: "LOGIN" }).click();
    // expect login success
    await page.locator('a[role="button"].nav-link.dropdown-toggle').click();
    await page.waitForSelector('a.dropdown-item[href="/dashboard/user"]');
    await page.getByRole("link", { name: "Dashboard" }).click();
    await page.waitForSelector(
      'a.list-group-item.list-group-item-action[href="/dashboard/user/profile"]'
    );
    // change back password
    await page.getByRole("link", { name: "Profile" }).click();
    await page.fill(
      'input[placeholder="Enter Your Password"]',
      "TestTest123123"
    );
    await page.getByRole("button", { name: "UPDATE" }).click();
    await page.locator('a[role="button"].nav-link.dropdown-toggle').click();
    await page.waitForSelector('a.dropdown-item[href="/dashboard/user"]');
    await page.getByRole("link", { name: "Logout" }).click();
  });
});

test("Changing User's Name", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByPlaceholder("Enter Your Email ").fill("123@Email.com");
  await page.getByPlaceholder("Enter Your Password").click();
  await page.getByPlaceholder("Enter Your Password").fill("TestTest123123");
  await page.getByRole("button", { name: "LOGIN" }).click();
  await page.locator('a[role="button"].nav-link.dropdown-toggle').click();
  await page.waitForSelector('a.dropdown-item[href="/dashboard/user"]');
  await page.getByRole("link", { name: "Dashboard" }).click();
  await page.waitForSelector(
    'a.list-group-item.list-group-item-action[href="/dashboard/user/profile"]'
  );
  await page.getByRole("link", { name: "Profile" }).click();
  await page.fill('input[placeholder="Enter Your Name"]', "John Doe");
  await page.getByRole("button", { name: "UPDATE" }).click();
  await page.getByRole("link", { name: "Home" }).click();
  await expect(page.locator("text=Profile Updated Successfully")).toBeVisible();
  await expect(page.getByRole("button", { name: "John Doe" })).toBeVisible();

  await page.locator('a[role="button"].nav-link.dropdown-toggle').click();
  await page.waitForSelector('a.dropdown-item[href="/dashboard/user"]');
  await page.getByRole("link", { name: "Logout" }).click();
});

test("Changing User address details", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByPlaceholder("Enter Your Email ").fill("123@Email.com");
  await page.getByPlaceholder("Enter Your Password").click();
  await page.getByPlaceholder("Enter Your Password").fill("TestTest123123");
  await page.getByRole("button", { name: "LOGIN" }).click();
  await page.locator('a[role="button"].nav-link.dropdown-toggle').click();
  await page.waitForSelector('a.dropdown-item[href="/dashboard/user"]');
  await page.getByRole("link", { name: "Dashboard" }).click();
  await page.waitForSelector(
    'a.list-group-item.list-group-item-action[href="/dashboard/user/profile"]'
  );
  await page.getByRole("link", { name: "Profile" }).click();
  await page.fill('input[placeholder="Enter Your Address"]', "Singapore");
  await page.getByRole("button", { name: "UPDATE" }).click();
  await expect(page.locator("text=Profile Updated Successfully")).toBeVisible();
  await page.getByRole("link", { name: "Home" }).click();
  await page.locator('a[role="button"].nav-link.dropdown-toggle').click();
  await page.waitForSelector('a.dropdown-item[href="/dashboard/user"]');
  await page.getByRole("link", { name: "Dashboard" }).click();
  await page.waitForSelector(
    'a.list-group-item.list-group-item-action[href="/dashboard/user/profile"]'
  );
  await expect(page.getByRole("heading", { name: "Singapore" })).toBeVisible();

  await page.locator('a[role="button"].nav-link.dropdown-toggle').click();
  await page.waitForSelector('a.dropdown-item[href="/dashboard/user"]');
  await page.getByRole("link", { name: "Logout" }).click();
});
