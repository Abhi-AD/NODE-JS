const { request } = require('http');
const Movie = require('../../movieModel')
const ApiFeatures = require('../../Utils/ApiFeatures');
const asyncErrorHandler = require('../../Utils/asyncErrorHandler');
const CustomError = require('../../Utils/CusotmError')
const { response } = require('express');

exports.getHigestRated = (request, response, next) => {
     request.query.limit = '5';
     request.query.sort = '-ratings';
     next();
}
// Routes handler function

// // without ApiFeatures code active this code 
// exports.getallMovie = async (request, response) => {
//      try {
//           //           /*          const excludeFields = ['sort', 'page', 'limit', 'fields'];
//           // //           const queryObj = { ...request.query };
//           // //           excludeFields.forEach((el) => {
//           // //                delete queryObj[el];
//           // //           })
//           // //           const movies = await Movie.find(queryObj);*/

//           // filter
//           let { sort, page, limit, fields, ...queryObj } = request.query;
//           let queryStr = JSON.stringify(queryObj);
//           queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
//           queryObj = JSON.parse(queryStr);

//           let query = Movie.find(queryObj);

//           // SORTING LOGIC
//           if (request.query.sort) {
//                const sortBy = sort.split(',').join(' ');
//                query = query.sort(sortBy);
//           } else {
//                query = query.sort('name');
//           }

//           // LIMITING FIELDS  
//           if (request.query.fields) {
//                const fields = fields.split(',').join(' ');
//                query = query.select(fields);
//           } else {
//                query = query.select('-__v');
//           }

//           // PAGINATION
//           page = page * 1 || 1;
//           limit = limit * 1 || 7;
//           const skip = (page - 1) * limit;
//           query = query.skip(skip).limit(limit);

//           const totalMovies = await Movie.countDocuments(queryObj);

//           if (skip >= totalMovies) {
//                throw new Error(`The page number ${page} is out of range.`);
//           }

//           const movies = await query;

//           response.status(200).json({
//                status: 'Search All Success...!',
//                length: movies.length,
//                data: { movies }
//           });
//      } catch (error) {
//           response.status(404).json({
//                status: 'Failed to Search Movies...!',
//                message: error.message
//           });
//      }
// }




// using the  ApiFeatures code active this code (reusable class)
exports.getallMovie = asyncErrorHandler(async (request, response, next) => {
     const features = new ApiFeatures(Movie.find(), request.query).filter().sort().limit().paginate();
     const movies = await features.query;
     response.status(200).json({
          status: 'Search All Success...!',
          length: movies.length,
          data: { movies }
     });
})


exports.addMovie = asyncErrorHandler(async (request, response, next) => {
     const movie = await Movie.create(request.body);
     response.status(201).json({
          status: 'Succesfully Created...!',
          data: {
               movie
          }
     })
});

exports.getoneMovie = asyncErrorHandler(async (request, response, next) => {
     // const movie = await Movie.find({_id: request.params.id});
     const movie = await Movie.findById(request.params.id);
     if (!movie) {
          const error = new CustomError('Movie with that IDF is not found...!', 404);
          return next(error);
     }
     response.status(200).json({
          status: 'Seacrch All Success...!',
          data: {
               movie
          }
     })
})


exports.updateMovie = asyncErrorHandler(async (request, response, next) => {
     const updateMovie = await Movie.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
     if (!updateMovie) {
          const error = new CustomError('Movie with that IDF is not found...!', 404);
          return next(error);
     }
     response.status(200).json({
          status: "Updated Successfuly...!",
          data: {
               movie: updateMovie
          }
     })
})

exports.deleteMovie = asyncErrorHandler(async (request, response, next) => {
     const deleteMovie = await Movie.findByIdAndDelete(request.params.id);
     if (!deleteMovie) {
          const error = new CustomError('Movie with that IDF is not found...!', 404);
          return next(error);
     }
     response.status(204).json({
          status: "Deleted Successfully...!",
          data: null
     });
})

// Aggregations pipline($match, $group)
exports.getmovieStats = asyncErrorHandler(async (request, response, next) => {
     const stats = await Movie.aggregate([
          { $match: { ratings: { $gte: 4.5 } } },
          {
               $group: {
                    _id: '$releaseYear',
                    avgRating: { $avg: '$ratings' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    priceTotal: { $sum: "$price" },
                    movieCount: { $sum: 1 }
               }
          },
          { $sort: { minPrice: 1 } },
          // { $match: { maxPrice: { $gte: 60 } } },

     ]);
     if (!stats) {
          const error = new CustomError('Movie with that IDF is not found...!', 404);
          return next(error);
     }
     response.status(200).json({
          status: "Successfull...!",
          count: stats.length,
          data: {
               stats
          }
     })
})

// Aggregations pipline($unwind, $project)
exports.getmovieByGenre = asyncErrorHandler(async (request, response, next) => {
     const genre = request.params.genre;
     const movies = await Movie.aggregate([
          { $unwind: '$genres' },
          {
               $group: {
                    _id: '$genres',
                    movieCount: { $sum: 1 },
                    movies: { $push: '$name' },
               }
          },
          { $addFields: { genre: "$_id" } },
          { $project: { _id: 0 } },
          { $sort: { movieCount: -1 } },
          // {$limit:1},
          { $match: { genre: genre } }
     ]);
     if (!movies) {
          const error = new CustomError('Movie with that IDF is not found...!', 404);
          return next(error);
     }

     response.status(200).json({
          status: "Successfull...!",
          count: movies.length,
          data: {
               movies
          }
     })
})
