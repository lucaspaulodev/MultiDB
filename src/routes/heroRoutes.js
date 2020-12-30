const BaseRoute = require('./base/baseRoute')

class HeroRoutes extends BaseRoute{
	constructor(database) {
		super()
		this.database = database
	}

	list() {
		return {
			path: '/heroes',
			method: 'GET',
			handler: (request, head) => {
				return this.database.read()
			}
		}
	}

}

module.exports = HeroRoutes