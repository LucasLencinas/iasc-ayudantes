// 192.168.3.35:3000
var http = require('http');
var io = require('socket.io-client');

var args = process.argv.slice(2);
var tipo = 'docente';
var nombre = args[0] || 'nombre';
var ip = args[1] || '127.0.0.1';

var socket = io('http://' + ip + ':3000', { query: 'tipo=' + tipo + '&' +
																										 'nombre=' + nombre});

socket.on('pregunta', function(consulta) {
	console.log('Hicieron una pregunta: ', JSON.stringify(consulta));
	setTimeout(function() {
		//Comienza a escribir respuesta
		socket.emit('escriborespuesta', { id: consulta.id, contenido: 'escriborespuesta' });
		setTimeout(function() {
			console.log('Esta escribiendo una respuesta');
  	}, 10000);
	  //Termina de escribir y envia respuesta
		socket.emit('respuesta', { id: consulta.id, contenido: 'respuesta' });
		console.log('Enviando respuesta');
	}, 500);
});

socket.on('respuesta', function(consulta) {
	console.log('Mandaron una respuesta: ', JSON.stringify(consulta));
});

socket.on('escriborespuesta', function(consulta) {
	console.log('ya estan respondiendo esta pregunta: ', JSON.stringify(consulta));
});


console.log(tipo + ': ' + nombre);
