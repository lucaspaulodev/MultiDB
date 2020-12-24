const ICrud = require('./interfaces/ICrud')
const Sequelize = require('sequelize')


class Postgres extends ICrud {
    constructor(){
        super()
        this._driver = null
        this._heroes = null
        this._connect()
    }

    async isConnected(){
        try{
            await this._driver.authenticate()
            return true
        }
        catch(error){
            console.log('error', error)
            return false
        }
    }

    async defineModel(){
        this._heroes = driver.define('heroes', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
    
            nome: {
                type: Sequelize.STRING,
                required: true
            },
    
            poder: {
                type: Sequelize.STRING,
                required: true
            }
    
            
        }, {
            tableName: 'TB_HEROES',
            freezeTableName: false,
            timestamps: false
        })
        await Heroes.sync()
    }

    create(item){
        console.log('O item foi salvo em Postgres')
    }

    _connect(){
        this._driver = new Sequelize(
            'heroes',
            'lucaspaulodev',
            'senha',
            {
                host: 'localhost',
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorAliases: false
            }
        )
    }
}

module.exports = Postgres