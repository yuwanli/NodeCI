const Page = require('./helpers/page')

let page;

beforeEach(async () => {
    page = await Page.build()

    await page.goto('http://localhost:3000')
})


afterEach(async () => {
    await page.close()
})

describe('when logged in', async () => {
    beforeEach(async () => {
        await page.login()
        await page.click('a.btn-floating')
    })

    test('can see blog create form',async () => {
        const label = await page.getContentsOf('form label')
    
        expect(label).toEqual('Blog Title')
    })

    describe('And using invalid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input','my title')
            await page.type('.content input','my content')
            await page.click('form button')
        })
    
        test('submitting takes user to review screen',async () => {
            const text = await page.getContentsOf('h5')
        
            expect(text).toEqual('Please confirm your entries')
        })

        test('submitting then saving adds blog to index page',async () => {
            await page.click('button.green')
            await page.waitFor('.card')

            const title = await page.getContentsOf('.card-title')
            const content = await page.getContentsOf('p')
            expect(title).toEqual('my title')
            expect(content).toEqual('my content')
        })
    })


    describe('And using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button')
        })
    
        test('can see blog create form',async () => {
            const titleError = await page.getContentsOf('.title .red-text')
            const contentError = await page.getContentsOf('.content .red-text')
        
            expect(titleError).toEqual('You must provide a value')
            expect(contentError).toEqual('You must provide a value')
        })
    })
})