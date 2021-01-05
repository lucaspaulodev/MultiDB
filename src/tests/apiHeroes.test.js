const assert = require('assert')
const api = require('../api')

let app = {}

describe('Test API heroes', () => {
    before(async () => {
        app = await api
    })

    it('List /heroes', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes?skip=0&limit=10'
        })
        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode
        
        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(data))
    })

    it('List /heroes must return only 3 items', async () => {
        const LIMIT_SIZE = 3
        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${LIMIT_SIZE}`
        })

        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(data.length === LIMIT_SIZE)
    })

    it('List /heroes must return error with incorrect limit', async () => {
        const LIMIT_SIZE = 'Aeee'

        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${LIMIT_SIZE}`
        })

        const errorResult = {
            "statusCode":400,
            "error":"Bad Request",
            "message":"child \"limit\" fails because [\"limit\" must be a number]",
            "validation":{
                "source":"query",
                "keys":["limit"]
            }
        }

        assert.deepStrictEqual(result.statusCode, 400)
        assert.deepStrictEqual(result.payload, JSON.stringify(errorResult))
    })

    it('List /heroes must filter an item', async () => {
        const NAME = 'Flash'

        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=3&nome=${NAME}`
        })

        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.deepStrictEqual(data[0].nome, NAME)
    })  
})