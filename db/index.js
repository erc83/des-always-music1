const { Pool } = require('pg')

const config = {
    user: 'erc83', 
    password: '2210',
    host: 'localhost',
    database:'amusic',
    port:5432
}

const pool = new Pool(config)
// de esta forma se puede utilizar async y await 
module.exports = {
    getClient: ()=> pool.connect(), //entrega un cliente pool.conect no se puede modificar  
    end: ()=> pool.end()
}