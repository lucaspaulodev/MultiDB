const assert = require('assert')
const Postgres = require('../database/strategies/postgres')
const Context = require('../database/strategies/base/contextStrategy')

const context = new Context(new Postgres());

describe('Postgres Strategy', () => {
    it('Postgres Connection', async () => {
        const result = await context.isConnected()
        assert.strictEqual(result, true)
    })
})