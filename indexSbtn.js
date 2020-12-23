const yargs = require('yargs');
const db = require('./db')
const createAndEditArgs = {
  nombre: {
    describe: "Nombre del nuevo estudiante",
    demand: true,
    alias: "n",
  },
  rut: {
    describe: "Identificación única del estudiante",
    demand: true,
    alias: "r",
  },
  curso: {
    describe: "Curso del estudiante",
    demand: true,
    alias: "c",
  },
  nivel: {
    describe: "Nivel del curso",
    demand: true,
    alias: "l",
  }
};
(async () => {
  const client = await db.connect()  
  const argv = yargs.command('nuevo', 'Comando para agregar un nuevo estudiante',createAndEditArgs,
    async (args) => {
      try {  
        const results = await client.query('INSERT INTO students (name, rut, course, level) values ($1, $2, $3, $4) RETURNING *', [args.nombre, args.rut, args.curso, args.nivel])
        console.log(results.rows[0]);
        client.release()
        db.end()
      } catch (error) {
        console.log('Error en la consulta', error);  
      }
  }).command('consulta','Ver todos los estudiantes', async (args)=>{ 
    try {
      const results = await client.query('SELECT * FROM students')
       client.release();
       db.end();
      console.log(results.rows);
    } catch (error) {
      console.log("Error en la consulta", error);  
    }
  }).help().argv
})()