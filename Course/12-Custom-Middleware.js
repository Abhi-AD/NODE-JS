

// import packages
const express = require('express');
const fs = require('fs')
const morgan = require('morgan')



let app = express();
let movies = JSON.parse(fs.readFileSync('../Data/movies.json'));


const logger = function (request, response, next) {
     console.log("Cusotom middleware called...!");
     next();

}



app.use(express.json());
app.use(morgan('dev'));
app.use(logger);
app.use((request, response, next) => {
     request.requestAt = new Date().toISOString();
     next();
});


// Routes handler function
const getallMovie = (request, response) => {
     response.status(200).json({
          status: 'success',
          requestAt: request.requestAt,
          count: movies.length,
          data: {
               movies: movies
          }
     })
}

const addMovie = (request, response) => {
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

const getoneMovie = (request, response) => {
     //     console.log(request.params);
     const id = request.params.id * 1;
     let idmovie = movies.find(el => el.id === id)

     if (!idmovie) {
          response.status(404).json({
               status: 'error',
               message: `Movie with ID ${id} is not found`
          })
     }

     response.status(200).json({
          status: 'succes',
          data: {
               movie: idmovie
          }
     })
}


const updateMovie = (request, response) => {
     let patchid = request.params.id * 1;
     let patchmovie = movies.find(el => el.id === patchid);
     if (!patchmovie) {
          return response.status(404).json({
               status: 'error',
               message: `Id ${patchid} is not found.`
          })
     }
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

const deleteMovie = (request, response) => {
     let deleteid = request.params.id * 1;
     let deletemovie = movies.find(el => el.id === deleteid);
     if (!deletemovie) {
          return response.status(404).json({
               status: 'error',
               message: `Id ${deleteid} is not found.`
          })
     }
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



// // API handling get  request 
// app.get('/api/v1/movies', getallMovie);
// // API handling post  request 
// app.post('/api/v1/movies', addMovie);
// // API handling get  request id
// app.get('/api/v1/movies/:id', getoneMovie);
// // API  handling patch request 
// app.patch('/api/v1/movies/:id', updateMovie);
// // API  handling delete request 
// app.delete('/api/v1/movies/:id', deleteMovie);




app.route('/api/v1/movies').get(getallMovie).post(addMovie);
app.route('/api/v1/movies/:id').get(getoneMovie).patch(updateMovie).delete(deleteMovie);




// create a server
const port = 3000;
app.listen(port, () => {
     console.log(`Server started at http://localhost:${port}`);
})





// Web API:- An API is a piece of software that can be used by another piece of software in order to allow application to talk to each other.
// APIs are not always used for sending data. The "Application" in API can actually mean many different things.
// The fs and http module in NODE JS are also APIs
// Browsers DOM APIs like fetch and getElementById
// A class in a programming language containing methods & properties.


// Rest architectural:- REST is an architectural style for providing standards between computer systems on the web, making it easier for systems to communicate with each other.
// 1: Separate APIs into logical resource
// 2: Expose structured, resource based url
// 3: Use HTTP method(GET, POST, PUT, PATCH, Delete)
// 4: Send JSON data in response
// 5: API must be stateless


// Stateless Restful API: All state is handled on the client. This means that can be request must cantain all the information necessary to process a certain request.


// PUT Vs PATCH
// 1- PUT is a method of modifying resource where the client sends data that uodates the enttire resource.
// 2- Patch is methof  of modifying resource where the client sends partial data that is to be updated without modifying the entire data.










