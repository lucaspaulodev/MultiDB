const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')

class HeroRoutes extends BaseRoute {
	constructor(database) {
		super()
		this.database = database
	}

	list() {
		return {
			path: '/heroes',
			method: 'GET',
			config: {
				validate: {
					failAction: (request, headers, erro) => {
						throw erro;
					},
					query: {
						skip: Joi.number().integer().default(0),
						limit: Joi.number().integer().default(3),
						nome: Joi.string().min(3).max(100)
					}
				}
			},
			handler: (request, headers) => {
				try {
					const {
						skip,
						limit,
						nome
					} = request.query

					const query = {
						nome: {
							$regex: `.*${nome}*.`
						}
					}
					return this.database.read(
						nome ? query : {},
						skip,
						limit
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