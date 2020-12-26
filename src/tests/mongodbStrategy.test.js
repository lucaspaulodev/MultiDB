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
const MOCK_HERO_UPDATE = {
    nome: `Patolino-${Date.now()}`,
    poder: 'Speed'
}

let MOCK_HERO_ID = ''

describe('MongoDB Strategy', () => {
    before(async () => {
        await context.connect()
        await context.create(MOCK_HERO_DEFAULT)
        const result = await context.create(MOCK_HERO_UPDATE)
        MOCK_HERO_ID = result._id
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

    it('Update hero', async () => {
        const result = await context.update(MOCK_HERO_ID, {
            nome: 'Perna Longa'
        })

        assert.deepStrictEqual(result.nModified, 1)
    })

    it('Delete Hero', async () => {
        const result = await context.delete(MOCK_HERO_ID)

        assert.deepStrictEqual(result.n, 1)
    })
})