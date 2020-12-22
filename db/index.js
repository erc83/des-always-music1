const { Pool } = require('pg')

const config = {
    user: 'erc83', 
    password: '2210',
    host: 'localhost',
    database:'amusic',
    port:5432
}

const pool = new Pool(config)

module.exports = {
    query: (text, args, callback) => {
        return pool.query(text, args, callback)
    }, 
    pool
}