const express = require('express');
const movieController = require('../Controllers/movieControllers');
const authController = require('../Controllers/authController')

const router = express.Router();

// router.param('id', movieController.checkId);
router.route('/highest-rated').get(movieController.getHigestRated, movieController.getallMovie);
// Aggregations pipline($match, $group)
router.route('/movie-stats').get(movieController.getmovieStats);
// Aggregations pipline($unwind, $projcect)
router.route('/movie-by-genre/:genre').get(movieController.getmovieByGenre);
router.route('/').get(authController.protect,movieController.getallMovie).post(movieController.addMovie);
router.route('/:id').get(authController.protect,movieController.getoneMovie).patch(movieController.updateMovie).delete(authController.protect,authController.restrict('admin', 'superadmin'),movieController.deleteMovie);

module.exports = router;