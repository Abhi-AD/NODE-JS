const express = require('express');
const movieController = require('../Controllers/movieControllers')

const router = express.Router();

// router.param('id', movieController.checkId);
router.route('/highest-rated').get(movieController.getHigestRated, movieController.getallMovie);
router.route('/').get(movieController.getallMovie).post(movieController.addMovie);
router.route('/:id').get(movieController.getoneMovie).patch(movieController.updateMovie).delete(movieController.deleteMovie);

module.exports = router;