const BaseRoute = require('./base/baseRoute')
const Joi = require('joi');
const Boom = require('boom')

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
					return Boom.internal()
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
					return Boom.internal()
				}
			}
		}
	}

	update() {
		return {
			path: '/heroes/{id}',
			method: 'PATCH',
			config: {
				validate: {
					params: {
						id: Joi.string().required()
					},
					payload: {
						nome: Joi.string().min(3).max(100),
						poder: Joi.string().min(2).max(100)
					}
				}
			},
			handler: async (request) => {
				try {
					const {
						id
					} = request.params

					const { payload } = request

					const stringData = JSON.stringify(payload)
					const data = JSON.parse(stringData)

					const result = await this.database.update(id, data)

					if (result.nModified !== 1) {
						return Boom.preconditionFailed('Dont was find in database')
					}
					return {
						message: 'Hero updated with success'
					}
				}
				catch (error) {
					console.log('Error', error)
					return Boom.internal()
				}
			}
		}
	}

	delete() {
		return {
			path: '/heroes/{id}',
			method: 'DELETE',
			config: {
				validate: {
					failAction,
					params: {
						id: Joi.string().required()
					}
				}
			},

			handler: async (request) => {
				try {
					const { id } = request.params

					const result = await this.database.delete(id)
					
					if (result.n !== 1) {
						return Boom.preconditionFailed('Dont was find in database')
					}

					return {
						message: 'Hero removed with success'
					}	
				}

				catch (error) {
					console.log('Error', error)
					return Boom.internal()
				}
			}

		}
	}
}

module.exports = HeroRoutes