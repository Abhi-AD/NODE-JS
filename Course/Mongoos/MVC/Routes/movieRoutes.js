const express = require('express');
const movieController = require('../Controllers/movieControllers');

const router = express.Router();

// router.param('id', movieController.checkId);
router.route('/highest-rated').get(movieController.getHigestRated, movieController.getallMovie);
// Aggregations pipline($match, $group)
router.route('/movie-stats').get(movieController.getmovieStats);
// Aggregations pipline($unwind, $projcect)
router.route('/movie-by-genre/:genre').get(movieController.getmovieByGenre);
router.route('/').get(movieController.getallMovie).post(movieController.addMovie);
router.route('/:id').get(movieController.getoneMovie).patch(movieController.updateMovie).delete(movieController.deleteMovie);

module.exports = router;