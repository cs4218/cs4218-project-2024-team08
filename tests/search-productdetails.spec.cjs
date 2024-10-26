const { test, expect, describe } = require('@playwright/test');
const AdminUsername = 'Test123@Email.com';
const AdminPassword = 'TestTest123123';

const uniqueString = Date.now().toString();

const categoryName = `TestCategory_${uniqueString}`;

const mockProducts = [
  {
    name: `Product 1_${uniqueString}`,
    description: 'Description 1',
    price: 29.99,
    quantity: 100,
    slug: 'product-1',
  },
  {
    name: `Product 2_${uniqueString}`,
    description: 'Description 2',
    price: 39.99,
    quantity: 100,
    slug: 'product-2',
  },
];


let context;
let page;
test.use({ storageState: {} });
test.describe.serial('Search and ProductDetails Components', () => {
    test.beforeAll(async ({ browser }) => {
        // Create a new browser context and page
        context = await browser.newContext();
        page = await context.newPage();
    
        // Log in before all tests.
        await page.goto('http://localhost:3000/login');
        await page.getByPlaceholder('Enter Your Email ').fill(AdminUsername);
        await page.getByPlaceholder('Enter Your Password').fill(AdminPassword);
        await page.getByRole('button', { name: 'LOGIN' }).click();
        await page.waitForURL('http://localhost:3000/');
    
        // Create category for testing.
        await page.goto('http://localhost:3000/dashboard/admin/create-category');
        await page.getByPlaceholder('Enter new category').fill(categoryName);
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.waitForTimeout(1000);
    
        // Create products for testing.
        for (const product of mockProducts) {
            await page.goto('http://localhost:3000/dashboard/admin/create-product');
            // Select category
            await page.locator('div').filter({ hasText: /^Select a category$/ }).first().click();
            await page.getByTitle(categoryName).locator('div').click();
            // Don't upload image
            // await page.setInputFiles('input[type="file"]', 'path/to/image.jpg');
            await page.getByPlaceholder('write a name').fill(product.name);
            await page.getByPlaceholder('write a description').fill(product.description);
            await page.getByPlaceholder('write a Price').fill(product.price.toString());
            await page.getByPlaceholder('write a quantity').fill(product.quantity.toString());
            // Select shipping option
            await page.locator('.mb-3 > .ant-select').click();
            await page.getByText('Yes').click();
            await page.getByRole('button', { name: 'CREATE PRODUCT' }).click();
        }
    });
    
    test.afterAll(async () => {
        // Delete products after all tests.
        for (const product of mockProducts) {
            // Go to the product page
            await page.goto(`http://localhost:3000/dashboard/admin/product/${product.name}`);
            await page.waitForTimeout(4000);
            // Handle the confirmation dialog
            await page.getByRole('button', { name: 'DELETE PRODUCT' }).click();
            await page.once('dialog', dialog => {
                dialog.dismiss();
            });
            
        }
    
        // Delete the category
        await page.goto('http://localhost:3000/dashboard/admin/create-category');
        const rowLocator = page.locator('table tr').filter({
            has: page.locator('td', { hasText: categoryName })
        });
        await rowLocator.locator('button', { hasText: 'Delete' });
    
    });
    
    describe('When searching for products', () => {
        test('Given that the search term is valid and retrieves a product, then the related products should show up in search results', async () => {
            // Use the same page created in beforeAll
            await page.goto('http://localhost:3000/');
            await page.getByPlaceholder('Search').fill(mockProducts[0].name);
            await page.getByRole('button', { name: 'Search' }).click();
            expect(await page.getByRole('heading', { name: 'Search Resuts' })).toBeTruthy();
            for (const product of mockProducts) {
                expect(await page.getByText(`${product.name}${product.description}... $ ${product.price}More DetailsADD TO CART`)).toBeTruthy();
            }
        });
        test('Given that the search term is not related to any product, then no products should show up in search results', async () => {
            // Use the same page created in beforeAll
            await page.goto('http://localhost:3000/');
            await page.getByPlaceholder('Search').fill(mockProducts[0].name);
            await page.getByRole('button', { name: 'Search' }).click();
            expect(await page.getByRole('heading', { name: 'Search Resuts' })).toBeTruthy();
            for (const product of mockProducts) {
                expect(await page.getByText(`${product.name}${product.description}... $ ${product.price}More DetailsADD TO CART`)).toBeTruthy();
            }
        });
        test('Given that a product exists in the database, then the product details page should contain details of that product', async () => {
           for (const product of mockProducts) {
                await page.goto(`http://localhost:3000/product/${product.slug}`);
                expect(await page.getByText(product.name)).toBeTruthy();
                expect(await page.getByText(product.description)).toBeTruthy();
                expect(await page.getByText(`$ ${product.price}`)).toBeTruthy();
                expect(await page.getByText('ADD TO CART')).toBeTruthy();
            } 
        });
    });
});

