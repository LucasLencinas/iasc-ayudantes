// 192.168.3.35:3000
var http = require('http');
var io = require('socket.io-client');

var args = process.argv.slice(2);
var tipo = 'alumno';
var nombre = args[0] || 'nombre';
var ip = args[1] || '127.0.0.1';

var socket = io('http://' + ip + ':3000', { query: 'tipo=' + tipo + '&' +
																										 'nombre=' + nombre});

socket.on('pregunta', function(pregunta) {
	console.log('Hicieron una pregunta: ', JSON.stringify(pregunta))
});

socket.on('respuesta', function(consulta) {
	console.log('Mandaron una respuesta: ', JSON.stringify(consulta));
});

console.log(tipo + ': ' + nombre);
setInterval(function() {
	socket.emit('pregunta', { contenido: 'llega?' });
	console.log('Enviando pregunta');
}, 5000);
