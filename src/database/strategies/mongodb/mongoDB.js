const ICrud = require('../interfaces/ICrud')
const Mongoose = require('mongoose')

const STATUS = {
    0: 'disconnect',
    1: 'connect',
    2: 'connecting',
    3: 'disconnecting'
}

class MongoDB extends ICrud {
    constructor(connection, schema){
        super()
        this._schema = schema
        this._connection = connection
    }

    async isConnected(){
        const state = STATUS[this._connection.readyState]
        if(state === 'connect') return state;
        if(state !== 'connecting') return state;
        
        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readyState]
    }

    static connect(){
        Mongoose.connect('mongodb://lucaspaulodev:senha@localhost:27017/heroes', {useNewUrlParser: true}, (err) => {
            if(!err) return;
            console.log('Fail to connect', err)
        })
        const connection = Mongoose.connection

        connection.once('open', () => {
            console.log('Databse is running...')
        })

        return connection
    }

    async create(item){
        return await this._schema.create(item)
    }

    async read(item, skip=0, limit=10) {
        return this._schema.find(item).skip(skip).limit(limit)
    }

    async update(id, item) {
        return this._schema.updateOne({_id: id}, {$set: item})
    }

    async delete(id) {
        return this._schema.deleteOne({_id: id})
    }
}

module.exports = MongoDB