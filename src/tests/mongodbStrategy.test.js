const assert = require('assert')
const MongoDB = require('../database/strategies/mongodb/mongoDB')
const HeroSchema = require('../database/strategies/mongodb/schemas/heroSchema')
const Context = require('../database/strategies/base/contextStrategy')

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

let context = {}

describe('MongoDB Strategy', () => {
    before(async () => {
        const connection = MongoDB.connect()
        context = new Context(new MongoDB(connection, HeroSchema))
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