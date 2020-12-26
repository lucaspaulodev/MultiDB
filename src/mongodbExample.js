

/*
    const state = connection.readyState
 0: disconnect
 1: connect
 2: connecting
 3:disconnecting
*/



async function main (){
    

    const listItems= await model.find()
    console.log('Listed Items', listItems)
}

main()