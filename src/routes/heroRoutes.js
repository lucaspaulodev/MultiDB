const BaseRoute = require('./base/baseRoute')
const Joi = require('joi');

function failAction (request, headers, erro) {
	throw erro;
}

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
					failAction,
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

	create() {
		return {
			path: '/heroes',
			method: 'POST',
			config: {
				validate: {
					failAction,
					payload: {
						nome: Joi.string().required().min(3).max(100),
						poder: Joi.string().required().min(2).max(100)
					}
				}
			},
			handler: async (request) => {
				try {
					const {nome, poder} = request.payload
					const result = await this.database.create({
						nome,
						poder
					})
					
					return {
						message: 'Hero registred with success',
						_id: result._id
					}
				}
				catch(error) {
					console.log('Error', error)
					return "Internal Error"
				}
			}
		}
	}

}

module.exports = HeroRoutes