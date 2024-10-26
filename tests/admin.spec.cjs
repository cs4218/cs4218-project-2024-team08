const { test, expect } = require("@playwright/test");
const { describe, beforeEach, afterEach } = test;

// Set the email and password for the admin user
// Admin user should be in the fake database
const adminEmail = "Test123@Email.com";
const adminPassword = "TestTest123123";
const adminUsername = "TestTest123123";

const generateCategory = () => {
  let category = '';
  while (category.length < 25) {
      category += Math.random().toString(36).substring(2);
  }
  return category.substring(0, 25);
}

describe.serial("Admin Create Category", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.waitForURL("http://localhost:3000/");
    await page.click("text=Login");
    await page.waitForURL("http://localhost:3000/login");
    await page.fill("input[id=exampleInputEmail1]", adminEmail);
    await page.fill("input[id=exampleInputPassword1]", adminPassword);
    await page.click('button.btn-primary:has-text("LOGIN")');
    await page.waitForURL("http://localhost:3000/");
    await page.click("text=" + adminUsername);
    await page.click("text=Dashboard");
    await page.waitForURL("http://localhost:3000/dashboard/admin");
    await page.click("text=Create Category");
    await page.waitForURL("http://localhost:3000/dashboard/admin/create-category");
  });

  test("should create a new category and display it on admin create category page", async ({ page }) => {
    const category = generateCategory();
    await page.fill("input[placeholder='Enter new category']", category);
    await page.click('button.btn-primary:has-text("Submit")');
    await expect(
      page.getByText(`${category} is created`)
    ).toBeVisible();
  });

  test("should edit a category and display the update on admin create category page", async ({ page }) => {
    const category = generateCategory();
    const editCategory = generateCategory();
    await page.fill("input[placeholder='Enter new category']", category);
    await page.click('button.btn-primary:has-text("Submit")');
    await expect(
      page.getByText(`${category} is created`)
    ).toBeVisible();
    const row = await page.locator("tr", { hasText: category});
    await row.locator('button:has-text("Edit")').click();
    const modalSubmit = ".ant-modal";
    const inputModal = `${modalSubmit} input[value="${category}"]`;
    await page.waitForSelector(modalSubmit);
    await page.fill(inputModal, editCategory);
    await page.click(`${modalSubmit} button[type="submit"]`);
    await expect(
      page.getByText(`${editCategory} is updated`)
    ).toBeVisible();
  });

  test("should delete the category and the category is not displayed on the admin create category page", async ({ page }) => {
    const category = generateCategory();
    await page.fill("input[placeholder='Enter new category']", category);
    await page.click('button.btn-primary:has-text("Submit")');
    await expect(
      page.getByText(`${category} is created`)
    ).toBeVisible();
    const row = await page.locator("tr", { hasText: category });
    await row.locator('button:has-text("Delete")').click();
    await expect(page.getByText("category is deleted")).toBeVisible();
    await expect(page.locator("tr", { hasText: category })).toHaveCount(0);
  });
});
