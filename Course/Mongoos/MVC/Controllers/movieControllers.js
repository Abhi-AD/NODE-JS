const { request } = require('http');
const Movie = require('../../movieModel')


exports.getHigestRated = (request, response, next) => {
     request.query.limit = '5';
     request.query.sort = '-ratings';
     next();
}
// Routes handler function
exports.getallMovie = async (request, response) => {
     try {
          /*          const excludeFields = ['sort', 'page', 'limit', 'fields'];
//           const queryObj = { ...request.query };
//           excludeFields.forEach((el) => {
//                delete queryObj[el];
//           })
//           const movies = await Movie.find(queryObj);*/


          let { sort, page, limit, fields, ...queryObj } = request.query;
          let queryStr = JSON.stringify(queryObj);
          queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
          queryObj = JSON.parse(queryStr);

          let query = Movie.find(queryObj);

          // SORTING LOGIC
          if (request.query.sort) {
               const sortBy = sort.split(',').join(' ');
               query = query.sort(sortBy);
          } else {
               query = query.sort('name');
          }

          // LIMITING FIELDS  
          if (request.query.fields) {
               const fields = fields.split(',').join(' ');
               query = query.select(fields);
          } else {
               query = query.select('-__v');
          }

          // PAGINATION
          page = page * 1 || 1;
          limit = limit * 1 || 7;
          const skip = (page - 1) * limit;
          query = query.skip(skip).limit(limit);

          const movies = await query;

          response.status(200).json({
               status: 'Search All Success...!',
               length: movies.length,
               data: { movies }
          });
     } catch (error) {
          response.status(404).json({
               status: 'Failed to Search Movies...!',
               message: error.message
          });
     }
}



exports.addMovie = async (request, response) => {
     try {
          const movie = await Movie.create(request.body);
          response.status(201).json({
               status: 'Succesfully Created...!',
               data: {
                    movie
               }
          })

     } catch (error) {
          response.status(400).json({
               status: 'Fail...!',
               message: error.message
          })
     }

}

exports.getoneMovie = async (request, response) => {
     try {
          // const movie = await Movie.find({_id: request.params.id});
          const movie = await Movie.findById(request.params.id);
          response.status(200).json({
               status: 'Seacrch All Success...!',
               data: {
                    movie
               }
          })
     } catch (error) {
          response.status(404).json({
               status: 'Not Found...!',
               message: error.message
          })
     }
}


exports.updateMovie = async (request, response) => {
     try {
          const updateMovie = await Movie.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
          response.status(200).json({
               status: "Updated Successfuly...!",
               data: {
                    movie: updateMovie
               }
          })
     } catch (error) {
          response.status(404).json({
               status: 'Failed to Update...!',
               message: error.message
          });
     }
}

exports.deleteMovie = async (request, response) => {
     try {
          await Movie.findByIdAndDelete(request.params.id);
          response.status(204).json({
               status: "Deleted Successfully...!",
               data: null
          });
     } catch (error) {
          return response.status(400).json({
               status: 'Failed...!',
               message: error.message
          });
     }
}




