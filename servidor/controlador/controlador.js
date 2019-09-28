var connection = require("../lib/conexiondb");

function actores(req, res) {
  connection.query("SELECT * FROM actor", function(err, result, fields) {
    if (err) {
      console.log(err);
      throw err;
    }
    res.send(result);
  });
}

function generos(req, res) {
  connection.query("SELECT * FROM genero", function(err, result, fields) {
    if (err) {
      console.log(err);
      throw err;
    }
    res.send(result);
  });
}

function directores(req, res) {
  connection.query("SELECT * FROM director", function(err, result, fields) {
    if (err) {
      console.log(err);
      throw err;
    }
    res.send(result);
  });
}

function competencias(req, res) {
  connection.query("SELECT * FROM competencia", function(err, result, fields) {
    if (err) {
      console.log(err);
      throw err;
    }
    res.send(result);
  });
}

function peliculasCompetencia(req, res) {
  var id = parseInt(req.params.id);
  connection.query(
    `SELECT p.id,p.poster,p.titulo,c.nombre FROM pelicula p    
    INNER JOIN voto v ON v.id_pelicula = p.id
    INNER JOIN competencia c ON c.id = v.id_competencia
    WHERE c.id = ${id}
    ORDER BY RAND() LIMIT 2`,
    function(err, result, fields) {
      if (err) {
        console.log(err);
        throw err;
      }
      if (result.length === 0) {
        return res.status(404).json("No existe la competencia");
      }

      let respuesta = {
        competencia: result[0].nombre,
        peliculas: result
      };

      res.send(JSON.stringify(respuesta));
    }
  );
}

function agregarVoto(req, res) {
  var id_competencia = req.params.idCompetencia;
  var id_pelicula = req.body.idPelicula;
  connection.query(
    `UPDATE voto SET cantidad_votos = cantidad_votos + 1
     WHERE id_pelicula = ${id_pelicula} AND id_competencia = ${id_competencia};`,
    function(err, result, fields) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(result);
      res.json(result);
    }
  );
}

function agregarCompetencia(req, res) {
  let check = [];
  let { genero, actor, director, nombre } = req.body;
  let query = `INSERT INTO competencia(nombre, genero_id, actor_id, director_id) VALUE ('${nombre}' `;
  genero !== undefined ? check.push(` , ${genero} `) : check.push(` ,NULL `);
  actor !== undefined ? check.push(`, '${actor}' `) : check.push(` ,NULL `);
  director !== undefined
    ? check.push(`, '${director}'`)
    : check.push(` ,NULL `);
  for (let i = 0; i < check.length; i++) {
    query = query + check[i];
    if (i === check.length - 1) {
      query = query + `); `;
    }
  }
  // Checkeamos si ya existe la competencia con ese mismo nombre
  connection.query(
    `SELECT * FROM competencia WHERE nombre = '${nombre}'`,
    function(err, result, fields) {
      if (result.length !== 0) {
        return res.status(422).send("La competencia ya existe");
      } else {
        let checkCantidadPelis = [];
        queryCantidadPelis = `SELECT p.id
        FROM pelicula p
        INNER JOIN actor_pelicula ap ON ap.pelicula_id = p.id
        INNER JOIN actor a ON a.id = ap.actor_id    
        WHERE `;
        if (genero !== undefined) {
          checkCantidadPelis.push(` p.genero_id = ${genero} `);
        }
        if (actor !== undefined) {
          checkCantidadPelis.push(` a.nombre = '${actor}' `);
        }
        if (director !== undefined) {
          checkCantidadPelis.push(` p.director = '${director}'  `);
        }
        for (let i = 0; i < checkCantidadPelis.length; i++) {
          queryCantidadPelis = queryCantidadPelis + checkCantidadPelis[i];
          if (i + 1 < checkCantidadPelis.length) {
            queryCantidadPelis = queryCantidadPelis + ` AND `;
          }
        }
        // Checkeamos si hay mas de dos peliculas para agregar a la competencia
        connection.query(queryCantidadPelis, function(err, result, fields) {
          if (result.length < 2) {
            console.log(result);
            return res
              .status(422)
              .send("La competencia debe tener mas de dos peliculas");
          } else {
            // Agregamos la competencia
            connection.query(query, function(err, result, fields) {
              console.log(genero, actor, director, nombre);
              console.log(query);
              return res
                .status(200)
                .json("La competencia fue agregada correctamente");
            });
          }
        });
      }
    }
  );
}

function eliminarCompetencia(req, res) {
  var id = parseInt(req.params.id);
  connection.query(`DELETE FROM voto WHERE id_competencia = ${id}`, function(
    err,
    result,
    fields
  ) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(result);
    });
  connection.query(`DELETE FROM competencia WHERE id = ${id}`, function(
    err,
    result,
    fields
  ) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(result);
    return res.status(200).json("La competencia fue eliminada correctamente");
  });
}

function modificarCompetencia(req, res) {
  var id = parseInt(req.params.id);
  var { nombre } = req.body;
  connection.query(
    `UPDATE competencia
  SET nombre = '${nombre}'
  WHERE id = ${id}`,
    function(err, result, fields) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(req.body, nombre);
      return res
        .status(200)
        .json("La competencia fue modificada correctamente");
    }
  );
}

function resultadosCompetencia(req, res) {
  var id = req.params.id;
  connection.query(
    `SELECT p.id as pelicula_id , p.poster,p.titulo, v.cantidad_votos as votos, c.nombre  FROM pelicula p    
    INNER JOIN voto v ON v.id_pelicula = p.id
    INNER JOIN competencia c ON c.id = v.id_competencia
    WHERE c.id = ${id}
    ORDER BY v.cantidad_votos DESC LIMIT 3`,
    function(err, result, fields) {
      if (err) {
        console.log(err);
        throw err;
      }
      let respuesta = {
        competencia: result[0].nombre,
        resultados: result
      };
      console.log(respuesta.resultados);
      res.send(respuesta);
    }
  );
}

function eliminarVotos(req, res) {
  let id = req.params.idCompetencia;
  connection.query(
    `UPDATE voto
    SET cantidad_voto = 0
    WHERE competencia_id = ${id}`,
    function(err, result, fields) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(result);
      res.send(respuesta);
    }
  );
}

module.exports = {
  competencias: competencias,
  eliminarCompetencia: eliminarCompetencia,
  modificarCompetencia: modificarCompetencia,
  generos: generos,
  actores: actores,
  directores: directores,
  peliculasCompetencia: peliculasCompetencia,
  agregarVoto: agregarVoto,
  resultadosCompetencia: resultadosCompetencia,
  agregarCompetencia: agregarCompetencia,
  eliminarVotos: eliminarVotos
};
