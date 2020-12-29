const assert = require('assert')
const api = require('../api')

let app = {}
describe('Test API heroes', () => {
    before(async () => {
        app = await api
    })

    it('List /heroes', () => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes'
        })
        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        console.log('result', result)
        
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Aray.isArray(data))
    })
})