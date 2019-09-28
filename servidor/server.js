var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controlador = require('../servidor/controlador/controlador');
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/generos', controlador.generos);

app.get('/directores', controlador.directores);

app.get('/actores', controlador.actores);

app.get('/competencias', controlador.competencias);

app.post('/competencias', controlador.agregarCompetencia);

app.put('/competencias/:id', controlador.modificarCompetencia);

app.delete('/competencias/:id', controlador.eliminarCompetencia);

app.get('/competencias/:id/peliculas', controlador.peliculasCompetencia);

app.get('/competencias/:id/resultados', controlador.resultadosCompetencia);

app.post('/competencias/:idCompetencia/voto', controlador.agregarVoto);

app.delete('/competencias/:idCompetencia/votos', controlador.eliminarVotos);

var puerto = process.env.PORT || 8080;

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});