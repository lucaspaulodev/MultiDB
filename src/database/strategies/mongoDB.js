const ICrud = require('./interfaces/ICrud')
const Mongoose = require('mongoose')

const STATUS = {
    0: 'disconnect',
    1: 'connect',
    2: 'connecting',
    3: 'disconnecting'
}

class MongoDB extends ICrud {
    constructor(){
        super()
        this._heroes = null
        this._driver = null
    }

    async isConnected(){
        const state = STATUS[this._driver.readyState]
        if(state === 'connect') return state;
        if(state !== 'connecting') return state;
        
        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._driver.readyState]
    }

    defineModel(){
        const heroSchema = new Mongoose.Schema({
            nome: {
                type: String,
                required: true
            },
            poder: {
                type: String,
                required: true
            },
            insertedAt: {
                type: Date,
                default: new Date()
            }
        })
        
        this._heroes = Mongoose.model('heroes', heroSchema)
    }

    connect(){
        Mongoose.connect('mongodb://lucaspaulodev:senha@localhost:27017/heroes', {useNewUrlParser: true}, (err) => {
            if(!err) return;
            console.log('Fail to connect', err)
        })
        const connection = Mongoose.connection

        this._driver = connection

        connection.once('open', () => {
            console.log('Databse is running...')
        })

        this.defineModel()

    }

    async create(item){
        return await this._heroes.create(item)
    }

    async read(item, skip=0, limit=10) {
        return this._heroes.find(item).skip(skip).limit(limit)
    }
}

module.exports = MongoDB