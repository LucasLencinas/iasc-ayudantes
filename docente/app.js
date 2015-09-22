// 192.168.3.35:3000
var http = require('http');
var io = require('socket.io-client');

var args = process.argv.slice(2);
var tipo = 'docente';
var nombre = args[0] || 'nombre';
var ip = args[1] || '127.0.0.1';
var consultas = [];
//Consultas = {id: int, estanRespondiendo: bool}

var socket = io('http://' + ip + ':3000', { query: 'tipo=' + tipo + '&' +
																										 'nombre=' + nombre});

socket.on('pregunta', function(consulta) {
	console.log('Preguntan: ', JSON.stringify(consulta));
	consulta.estanRespondiendo = false;
	consultas.push(consulta);
	setTimeout(function() {
		//Comienza a escribir respuesta
		if (!consulta.estanRespondiendo) {
			console.log('Escribiendo respuesta');
			socket.emit('escriborespuesta', { id: consulta.id, contenido: 'escriborespuesta' });
			setTimeout(function() {

				console.log('Enviando respuesta');
				socket.emit('respuesta', { id: consulta.id, contenido: 'respuesta' });
			}, 1000 + Math.random()*3000);
		}
		//Termina de escribir y envia respuesta
	}, 1000 + Math.random()*3000);
});

socket.on('respuesta', function(consulta) {
	console.log('Mandaron una respuesta: ', JSON.stringify(consulta));
});

socket.on('escriborespuesta', function(consulta) {
	console.log('ya estan respondiendo esta pregunta: ', JSON.stringify(consulta));
	consulta = consultas.filter(function (c) {
		return c.id == consulta.id;
	})[0];

	consulta.estanRespondiendo = true;
});

console.log(tipo + ': ' + nombre);
