const { request } = require('http');
const Movie = require('../movieModel')

let movies = JSON.parse(fs.readFileSync('../Data/movies.json'));


exports.validateBody = (request, response, next) => {
     if (!request.body.name || !request.body.year) {
          return response.status(400).json({
               status: 'error',
               message: `Not a valid data `
          });
     }
     next();
}





// Routes handler function
exports.getallMovie = (request, response) => {
     response.status(200).json({
          status: 'success',
          requestAt: request.requestAt,
          count: movies.length,
          data: {
               movies: movies
          }
     })
}

exports.addMovie = (request, response) => {
     const newId = movies[movies.length - 1].id + 1;
     const newMovie = Object.assign({ id: newId }, request.body)
     movies.push(newMovie);
     fs.writeFile("../Data/movies.json", JSON.stringify(movies), (err) => {
          response.status(201).json({
               status: 'success',
               data: {
                    movie: newMovie
               }
          })
     });
}

exports.getoneMovie = (request, response) => {
     const id = request.params.id * 1;
     let idmovie = movies.find(el => el.id === id)

     // if (!idmovie) {
     //      response.status(404).json({
     //           status: 'error',
     //           message: `Movie with ID ${id} is not found`
     //      })
     // }

     response.status(200).json({
          status: 'succes',
          data: {
               movie: idmovie
          }
     })
}


exports.updateMovie = (request, response) => {
     let patchid = request.params.id * 1;
     let patchmovie = movies.find(el => el.id === patchid);
     // if (!patchmovie) {
     //      return response.status(404).json({
     //           status: 'error',
     //           message: `Id ${patchid} is not found.`
     //      })
     // }
     let patchindex = movies.indexOf(patchmovie);
     Object.assign(patchmovie, request.body);
     movies[patchindex] = patchmovie;
     fs.writeFile('../Data/movies.json', JSON.stringify(movies), (err) => {
          response.status(200).json({
               status: 'succes',
               data: {
                    movie: patchmovie
               }
          })
     })
}

exports.deleteMovie = (request, response) => {
     let deleteid = request.params.id * 1;
     let deletemovie = movies.find(el => el.id === deleteid);
     // if (!deletemovie) {
     //      return response.status(404).json({
     //           status: 'error',
     //           message: `Id ${deleteid} is not found.`
     //      })
     // }
     let deleteindex = movies.indexOf(deletemovie);
     movies.splice(deleteindex, 1);
     fs.writeFile('../Data/movies.json', JSON.stringify(movies), err => {
          response.status(204).json({
               status: 'success',
               data: {
                    movie: null,
               }
          });
     })
}

