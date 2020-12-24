const Sequelize = require('sequelize')

const driver = new Sequelize(
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

async function main () {
    const Heroes = driver.define('heroes', {
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

    const result = await Heroes.findAll({
        raw: true
    })

    console.log('result', result)
}

main()