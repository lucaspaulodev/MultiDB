sudo docker exec -it 3de200b9c3b2 \
    mongo -u lucaspaulodev -p senha --authenticationDatabase heroes

// DATABASES
show dbs

// chang db context
use heroes

// show tables
show collections

db.heroes.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

db.heroes.find()
db.heroes.find().pretty()

// create

db.heroes.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
})

// read
db.heroes.find()

//update
db.heroes.update({_id: ''},
    {nome: 'Wonder Woman'})

db.heroes.update({_id: ObjectId('')},
{$set: {nome: 'green lantern'}})

//delete
db.heroes.remove({})

