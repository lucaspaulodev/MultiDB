const assert = require('assert')
const Postgres = require('../database/strategies/postgres')
const Context = require('../database/strategies/base/contextStrategy')

const context = new Context(new Postgres());
const MOCK_HERO_CREATE = {
    nome: 'Gaviao Arqueiro',
    poder:  'flexas'
}

const MOCK_HERO_UPDATE = {
    nome: 'Batman',
    poder:  'dinheiro'
}

describe('Postgres Strategy', () => {
    beforeEach(async () => {
        await context.connect()
        await context.create(MOCK_HERO_UPDATE)
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

    it('Update Hero', async () => {
        const [updateItem] = await context.read({nome: MOCK_HERO_UPDATE.nome})

        const newItem = {
            ...MOCK_HERO_UPDATE,
            nome: 'Wonder Woman'
        }

        const [result] = await context.update(updateItem.id, newItem)
        const [updatedItem] = await context.read({id: updateItem.id})

        assert.deepStrictEqual(result, 1)
        assert.deepStrictEqual(updatedItem.nome, newItem.nome)
    })
})