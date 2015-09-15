//==========
//===EH LEE LA DOCUMENTACIÓN ACA=====
//==http://expressjs.com/guide/routing.html===
//==Para más detalles de la API MIRA ACA===
//==http://expressjs.com/4x/api.html
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore-node');

http.listen(3000, function(){
  console.log('listening on *:3000');
});

/*
alumno = {'socket':123,'id':12,'nombre':'lucas'}
docente = {'socket':123,'id':12,'nombre':'franco'}

listaPreguntas = [{'consulta':{'nombreAlumno':'lucas', 'consulta','que hora es?'},
  'respuesta': 'docente':'franco','respuesta':'las diez'}]
*/

var consultas = [];
var ultimoIdConsultas = 0;
var alumnos = [];
var docentes = [];

io.on('connection', function (socket) {
  if(socket.handshake.query.tipo == 'alumno'){
    var alumno = {};
    alumno.socket = socket;
    alumno.nombre = socket.handshake.query.nombre;
    console.log("Se conecto el alumno: " + alumno.nombre);
    alumnos.push(alumno);
    agregarComportamientoAlSocketAlumno(alumno);
  }else{
    var docente = {};
    docente.socket = socket;
    docente.nombre = socket.handshake.query.nombre;
    console.log("Se conecto el docente: "+ docente.nombre);
    docentes.push(docente);
    agregarComportamientoAlSocketDocente(docente);
  }
});

//--------------------mensajes abajo----------------

function agregarComportamientoAlSocketAlumno(alumno){
  alumno.socket.on('pregunta', function(msg){
    console.log("Me hacen una pregunta" + JSON.stringify(msg));

    ultimoIdConsultas++;
    var consulta = { id: ultimoIdConsultas };

    consulta.pregunta = { nombreAlumno: alumno.nombre,
                          contenido: msg.contenido };
    alumno.socket.broadcast.emit("pregunta", consulta);
    consultas.push(consulta);
  });

}

function agregarComportamientoAlSocketDocente(docente){
  docente.socket.on('respuesta', function(respuesta){
    var consulta = _.find(consultas, function(unaConsulta) {
      return unaConsulta.id == respuesta.id;
    });

    if (isEmptyObject(consulta.respuesta)) {
      consulta.respuesta = { nombreDocente: docente.nombre,
                             contenido: respuesta.contenido };
      docente.socket.broadcast.emit("respuesta", consulta);
      console.log("Responden una pregunta: " + JSON.stringify(respuesta));
    } else {
      console.log("Ya respondieron esta pregunta (respuesta ignorada: "
                  + JSON.stringify(respuesta) + ")");
    }
  });

  docente.socket.on('escriborespuesta', function(respuesta){
    console.log("Ya estan respondiendo: " + JSON.stringify(respuesta));
    docente.socket.broadcast.emit("escriborespuesta", respuesta);
  });
}


function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}
