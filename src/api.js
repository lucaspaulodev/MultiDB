const Hapi = require('hapi')
const Context = require('./database/strategies/base/contextStrategy')
const MongoDb = require('./database/strategies/mongodb/mongoDB')
const heroSchema = require('./database/strategies/mongodb/schemas/heroSchema')

const HeroRoute = require('./routes/heroRoutes')
const AuthRoute = require('./routes/authRoutes')

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const JWT_SECRET = 'SECRET123'

const app = new Hapi.Server({
	port: 5000
})

function mapRoutes(instance, methods) {
	return methods.map(method => instance[method]())
}

async function main() {
	const connection = MongoDb.connect()
	const context = new Context(new MongoDb(connection, heroSchema))
	const swaggerOptions = {
		info: {
			title: 'API Heroes - NODEBR',
			version: 'v1.0'
		},
		lang: 'pt'
	}

	await app.register([
		Vision,
		Inert,
		{
			plugin: HapiSwagger,
			options: swaggerOptions
		}
	])

	app.route([
		...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
		...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods())
	])

	await app.start()

	console.log('Server up in port', app.info.port)

	return app
}

module.exports = main()