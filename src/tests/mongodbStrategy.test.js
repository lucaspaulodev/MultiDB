const assert = require('assert')
const MongoDB = require('../database/strategies/mongoDB')
const Context = require('../database/strategies/base/contextStrategy')

const context = new Context(new MongoDB());

describe('MongoDB Strategy', function () {
    this.beforeEach(async () => {
        await context.connect()
    })
    
    it('Verify connection', async () => {
        const result = await context.isConnected()

        const expected = 'connect'

        assert.deepStrictEqual(result, expected)
    })
})