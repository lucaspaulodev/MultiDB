const assert = require('assert')
const MongoDB = require('../database/strategies/mongoDB')
const Context = require('../database/strategies/base/contextStrategy')

const context = new Context(new MongoDB());

const MOCK_HERO_CREATE = {
    nome: 'Flash',
    poder: 'Velocidade'
}
const MOCK_HERO_DEFAULT = {
    nome: `Spider Man-${Date.now()}`,
    poder: 'super net'
}

describe('MongoDB Strategy', () => {
    before(async () => {
        await context.connect()
        await context.create(MOCK_HERO_DEFAULT)
    })

    it('Verify connection', async () => {
        const result = await context.isConnected()

        const expected = 'connect'

        assert.deepStrictEqual(result, expected)
    })

    it('Create hero', async () => {
        const {nome, poder} = await context.create(MOCK_HERO_CREATE)

        assert.deepStrictEqual({nome, poder}, MOCK_HERO_CREATE)
    })

    it('List Hero', async () => {
        const [{nome, poder}] = await context.read({nome: MOCK_HERO_DEFAULT.nome})

        const result = {
            nome, poder
        }

        assert.deepStrictEqual(result,  MOCK_HERO_DEFAULT)
    })
})