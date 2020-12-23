const { Pool } = require('pg');
const config = {
  user: 'sbstn',
  password: 'ruby',
  host: 'localhost',
  port: 5432,
  database: 'am'
}
const pool = new Pool(config)
module.exports = {
  connect: () =>  { 
    try {
      return pool.connect(); // entrega un cliente
    } catch (error) {
      console.log('Error en la conexión', error.stack);
    }
  }, 
  end: () => pool.end()
}