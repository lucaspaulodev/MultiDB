const assert = require('assert')
const api = require('../api')
let app = {}


describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api
    })
    it('deve obter um token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'Xuxadasilva',
                password: '123'
            }
        });
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(JSON.parse(result.payload).token.length > 10)
    })

    it('deve retornar não autorizado ao tentar obter um token com login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'lucaspaulo',
                password: '123'
            }
        });
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 401)
        assert.deepStrictEqual(JSON.parse(result.payload).error, "Unauthorized")
    })
})