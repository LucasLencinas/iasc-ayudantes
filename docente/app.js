// 192.168.3.35:3000
var http = require('http');
var io = require('socket.io-client');

var args = process.argv.slice(2);
var tipo = 'docente';
var nombre = args[0] || 'nombre';

var socket = io('http://192.168.3.35:3000', { query: 'tipo=' + tipo + '&' +
																										 'nombre=' + nombre});

socket.on('pregunta', function(consulta) {
	console.log('Hicieron una pregunta: ', JSON.stringify(consulta));
	setTimeout(function() {
		socket.emit('respuesta', { id: consulta.id, contenido: 'respuesta' });
		console.log('Enviando respuesta');
	}, 500);
});

socket.on('respuesta', function(consulta) {
	console.log('Mandaron una respuesta: ', JSON.stringify(consulta));
});

console.log(tipo + ': ' + nombre);
