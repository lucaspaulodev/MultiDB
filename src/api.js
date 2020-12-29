const Hapi = require('hapi')
const Context  = require('./database/strategies/base/contextStrategy')
const MongoDb = require('./database/strategies/mongodb/mongoDB')
const heroSchema = require('./database/strategies/mongodb/schemas/heroSchema')

const app = Hapi.Server({
    port: 5000
})

async function main () {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, heroSchema))

    app.route([{
        path: '/heroes',
        method: 'GET',
        handler: (request, head) => {
            return context.read()
        }
    }])

    await app.start()
    console.log('Server up in port', app.info.port)

    return app
}

module.exports = main()