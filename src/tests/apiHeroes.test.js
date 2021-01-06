const assert = require('assert')
const api = require('../api')

let app = {}

const MOCK_HERO_SIGNUP = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta bionica'
}

const MOCK_INITIAL_HERO = {
    nome: 'Ranger Hawk',
    poder: 'Mira'
}

let MOCK_ID = ''

describe('Test API heroes', () => {
    beforeEach(async () => {
        app = await api

        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            payload: JSON.stringify(MOCK_INITIAL_HERO)
        })

        const data = JSON.parse(result.payload)

        MOCK_ID = data._id
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
    
    it('Sign Up /heroes', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            payload: MOCK_HERO_SIGNUP
        })

        const statusCode = result.statusCode

        const {message, _id} = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepStrictEqual(message, "Hero registred with success")
    })

    it('Update with patch /heroes/:id', async () => {
        const _id = MOCK_ID

        const expected = {
            poder: 'Super Mira'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            payload: JSON.stringify(expected)
        })

        const statusCode = result.statusCode

        const data = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(data.message, 'Hero updated with success')
    })

    it('Dont be able update with invalid ID patch /heroes/:id', async () => {
        const _id = `5ff60518d88081318f4af475`

        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            payload: JSON.stringify({
                poder: 'Super Mira'
            })
        })

        const statusCode = result.statusCode


        const data = JSON.parse(result.payload)

        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Dont was find in database'
        }

        assert.ok(statusCode === 412)
        assert.deepStrictEqual(data, expected)
    })

    it('Remove with DELETE /heroes/:id', async () => {
        const _id = MOCK_ID
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(data.message, 'Hero removed with success')
    })

    it('Dont be able to remove with DELETE /heroes/:id', async () => {
        const _id = `5ff60518d88081318f4af475`
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)

        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Dont was find in database'
        }

        assert.ok(statusCode === 412)
        assert.deepStrictEqual(data, expected)
    })

    it('Dont be able to remove with invalid ID - DELETE /heroes/:id', async () => {
        const _id = `INVALID_ID`
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)

        const expected = {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred'
        }

        assert.ok(statusCode === 500)
        assert.deepStrictEqual(data, expected)
    })
})