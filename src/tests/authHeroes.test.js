const assert = require('assert')
const api = require('../api')

let app = {}

describe.only('Auth test suite', async () => {
    before(async () => {
        app = await api
    })

    it('Must obtain a token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'Lpzinnn',
                password: '123'
            }
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)

        console.log(data)
        
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(data.token.length > 10)
    })
})