const yargs = require('yargs');
const db = require('./db/index');    //('./db')  asi igual llama al index de esa carpeta

const createAndEditArgs = {
    nombre: {
        describe: 'Nombre del nuevo estudiate',
        demand: true,
        alias: 'n'
    },
    rut: {
        describe:'Identificación única del estudiante',
        demand: true,
        alias: 'r'
    },
    curso: {
        describe:'Curso del estudiante',
        demand: true,
        alias: 'c'
    },
    nivel: {
        describe: 'Nivel del estudiante',
        demand: true,
        alias: 'l'
    }};
(async()=>  {
    let client 
    try {
        client = await db.getClient();
    } catch (error) {
        console.log('Error en la conexion', error.stack);
    }
//const argv = yargs.comand(). comand(). comand().help().argv
//node index.js nuevo -n=elias -r=12345678-0 -c='prekinder' -l=0
const argv = yargs.command('nuevo', 'Comando para agregar un nuevo estudiante',createAndEditArgs,
    async(args) =>{
        const queryObject = {
            text:'INSERT INTO students (name, rut, course, level) VALUES ($1, $2, $3, $4) RETURNING  *', 
            values:[args.nombre, args.rut, args.curso, args.nivel]
        }
        const results = await client.query(queryObject) 
        client.release();                                           
        db.end();                                                   
        console.log(results.rows[0])
    }
    // node index.js consulta
).command('consulta', 'muestra todos los estudiantes', async ()=>{ 
    const results = await client.query('SELECT * FROM students') //query metodo de pool no se modifica retorno metodo query
    client.release();                                           // release metodo de pool no se modifica
    db.end();                                                   // end metodo de poll no se modifica
    console.log(results.rows)
    //node index.js editar -n=elias -r=15724314-6 -c='prekinder' -l=0
}).command('editar', 'actualiza el estudiante',createAndEditArgs,async(args) =>{
    const queryEdit = {
        text: 'UPDATE students set name=$1, course=$3, level=$4 where rut =$2  RETURNING *',
        values: [args.nombre, args.rut, args.curso, args.nivel], 
        name: 'update student por rut',
        //rowMode: 'array'
        // rowMode devuelve un array sin row mode devuelve un objeto
        }
        const results = await client.query(queryEdit) 
        client.release();                                           
        db.end();                                                   
        console.log(results.rows[0]
)
//  node index.js consultarut -r=15724314-6
}).command('consultarut', 'consulta 1 estudiante por rut toda su informacion', {rut:createAndEditArgs.rut}, async(args)=>{     
    // let client esta aqui declarado arriba y esta disponible para cualquier command
    const results = await client.query('SELECT * FROM students where rut=$1', [args.rut])
    client.release();                                           // release metodo de pool no se modifica
    db.end();                                                   // end metodo de poll no se modifica
    console.log(results.rows[0])
    // node index.js eliminar -r=12345678-9
}).command('eliminar', 'eliminar 1 estudiante por rut', {rut:createAndEditArgs.rut} , async(args)=>{ 
    // let client
    const results = await client.query('DELETE FROM students where rut=$1 RETURNING *', [args.rut])
    client.release();                                           // release metodo de pool no se modifica
    db.end();                                                   // end metodo de poll no se modifica
    console.log(results.rows[0])

}).help().argv
})()