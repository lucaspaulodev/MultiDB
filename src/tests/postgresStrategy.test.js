const assert = require('assert')
const Postgres = require('../database/strategies/postgres')
const Context = require('../database/strategies/base/contextStrategy')

const context = new Context(new Postgres());
const MOCK_HERO_CREATE = {
    nome: 'Gaviao Arqueiro',
    poder:  'flexas'
}

describe('Postgres Strategy', () => {
    beforeEach(async () => {
        db = await context.connect()
    })
    it('Postgres Connection', async () => {
        const result = await context.isConnected()
        assert.strictEqual(result, true)
    })

    it('Create hero', async () => {
        const result = await context.create(MOCK_HERO_CREATE);
        console.log(result)
        delete result.id
        assert.deepStrictEqual(result, MOCK_HERO_CREATE)
    })

    it('Read Heroes', async () => {
        const [result] = await context.read({nome: MOCK_HERO_CREATE.nome});
        delete result.id
        assert.deepStrictEqual(result, MOCK_HERO_CREATE)
    })
})