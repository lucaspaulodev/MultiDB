const BaseRoute = require('./base/baseRoute')

class HeroRoutes extends BaseRoute {
	constructor(database) {
		super()
		this.database = database
	}

	list() {
		return {
			path: '/heroes',
			method: 'GET',
			handler: (request, headers) => {
				try {
					const {
						skip,
						limit,
						nome
					} = request.query

					let query = {}

					if(nome){
						query.nome = nome
					}

					if(isNaN(skip)){
						throw Error('The typeof skip is incorrect')
					}

					if(isNaN(limit)){
						throw Error('The typeof limit is incorrect')
					}

					return this.database.read(
						query,
						parseInt(skip),
						parseInt(limit)
					)
				}
				catch (error) {
					console.log('Error', error)
					return "Server Error"
				}

			}
		}
	}

}

module.exports = HeroRoutes