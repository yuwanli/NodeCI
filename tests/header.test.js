const Page = require('./helpers/page')


let page;

beforeEach(async () => {
    page = await Page.build()

    await page.goto('http://localhost:3000')
})


afterEach(async () => {
    await page.close()
})

// test('the header has the correct text',async () => {
    
//     const text = await page.$eval('a.brand-logo', el => el.innerHTML)

//     expect(text).toEqual('Blogster')
// })


test('when sign,show logout button',async () => {
    await page.login()
    const text = await page.getContentsOf('a[href="/auth/logout"]')
    expect(text).toEqual('Logout')
})