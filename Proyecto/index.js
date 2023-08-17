//DECLARACIONES Y CONFIGURACIONES INICIALES
const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extend: true}));
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');
// FIN DECLARACIONES

/// AVISODE QUE EL PUERTO 8080 ESTA LEVANTADO
app.listen(8080,(err)=>{
    if (err){
        console.log(err);
    }else{
        //console.log("hola")
    }
});
///FIN

///CONEXION BASE DE DATOS

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'Mariano1997',
    database : 'backend'
});

// conectarse a mysql
connection.connect(function(err) {
    // en caso de error
    if(err){
    console.log(err);
    }else{
        //console.log("Bd conectada")
    }
});
/// FIN

///ENDPOINTS
//cargo la tabla personas 
app.post('/api/persona', (req, res) => {
    const parametros = [req.body.dni, req.body.nombre, req.body.apellido];
    const query = 'INSERT INTO persona (dni, nombre, apellido) VALUES (?, ?, ?)';
    
    connection.query(query, parametros, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send("Se creó la persona " + req.body.nombre + " " +  req.body.apellido);
        }
    });
});
//cargo la tabla usuario
app.post('/api/usuario', (req, res) => {
    const parametros = [req.body.mail, req.body.nickname, req.body.password, req.body.persona_dni];
    const query = 'INSERT INTO usuario (mail,nickname,password,persona_dni) VALUES (?, ?, ?,?)';
    
    connection.query(query, parametros, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send("Se creó el usuario" + req.body.nickname );
        }
    });
});


//listo la tabla personas 
app.get('/api/persona', (req, res) => {
    const query = 'SELECT * FROM persona';

    connection.query(query, (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(rows);
        }
    });
});
//listo la tabla usuario
app.get('/api/usuario', (req, res) => {
    const query = 'SELECT * FROM usuario';

    connection.query(query, (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(rows);
        }
    });
});
//listo la persona a partir del apellido
app.get('/api/persona/:apellido', (req, res) => {
    const apellido = req.params.apellido;
    const query = 'SELECT * FROM persona WHERE apellido = ?';

    connection.query(query, [apellido], (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(rows);
        }
    });
});
//listo el usuario a partir del email
app.get('/api/usuario/:email', (req, res) => {
    const email = req.params.email;
    const query = 'SELECT * FROM usuario WHERE mail = ?';

    connection.query(query, [email], (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(rows);
        }
    });
});
//listo el nickname del usuario a a partir del dni de la persona
app.get('/api/persona/:dni/user', (req, res) => {
    const dni = req.params.dni;
    const query = 'SELECT u.nickname FROM usuario u INNER JOIN persona p ON u.persona_dni = p.dni WHERE p.dni = ?';

    connection.query(query, [dni], (err, rows) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (rows.length === 0) {
                res.send("Esta persona no tiene usuario asociado.");
            } else {
                res.send(rows[0].nickname);
            }
        }
    });
});

//modifico la persona a aprtir del dni
app.put('/api/persona/:dni', (req, res) => {
    const parametros = [req.body.dni,req.body.nombre, req.body.apellido, req.params.dni];
    const query = 'UPDATE persona SET dni=?, nombre=?, apellido=? WHERE dni=?';
    
    connection.query(query, parametros, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send("Se actualizó la persona " + req.body.nombre + " " + req.body.apellido);
        }
    });
});

//elimino la persona a partir del dni
app.delete('/api/persona/:dni', (req, res)=> {
    parametros = [req.params.dni];
    persona_dni=req.params.dni
    query='DELETE FROM persona WHERE dni= ?';
    query='DELETE FROM usuario WHERE persona_dni= ?'; 
    //La variale llamada persona_dni que es el dni, esta definido unas lineas mas arriba.
    // Esto hice por que al tener el dni de la persona como FK de la tabla usuario no me dejaba eliminar.
    connection.query(query, parametros, (err, rows)=>{
        if (err){
            res.status(500).send(err);
            return
        } else {
            if (rows.affectedRows==0){
                res.status(404).send({
                    message: "no se encontro la persona " + req.params.dni,
                });
            }else{
                res.send({
                    message: "se elimino la persona " + req.params.dni,
                })
            }
        }
    })

})


