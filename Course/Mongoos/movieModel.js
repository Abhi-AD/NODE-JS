const mongoose = require('mongoose')
const fs = require('fs');
const { error } = require('console');

const movieSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, 'Name is  required field...!'],
          unique: true,
          trim: true
     },
     description: {
          type: String,
          required: [true, 'Name is  required field...!'],
          trim: true
     },
     duration: {
          type: Number,
          required: [true, 'Duration is required field...!'],
     },
     ratings: {
          type: Number,
     },
     totalRating: {
          type: Number
     },
     releaseYear: {
          type: Number,
          required: [true, 'Release Year is required field...!']
     },
     releaseDate: {
          type: Date
     },
     createAt: {
          type: Date,
          default: Date.now(),
          select: false
     },
     genres: {
          type: [String],
          required: [true, 'Geners is required field...!']
     },
     directors: {
          type: [String],
          required: [true, 'Directors is required field...!']
     },
     coverImages: {
          type: String,
          require: [true, 'Cover Images is required field...!']
     },
     actors: {
          type: [String],
          required: [true, 'Actors is required field...!']
     },
     price: {
          type: Number,
          required: [true, 'Price is required field...!']
     },
     createBy: String,
}, {
     toJSON: { virtuals: true },
     toObject: { virtuals: true }
});




// virtual properties
movieSchema.virtual('durationInHours').get(function () {
     return this.duration / 60;
})





// Document Middleware
// .save() or .create
movieSchema.pre('save', function (next) {
     this.createBy = 'Abhishek Dangi'
     next();
})


// .save() or .create
movieSchema.post('save', function (document, next) {
     const content = `A new movie document with name ${document.name} has been create by ${document.createBy}\n `;
     fs.writeFileSync('../Data/Database/log.txt', content, { flag: 'a' }, (error) => {
          console.log(error)
     });
     next();
});









// Query Middleware
movieSchema.pre(/^find/, function (next) {
     this.find({ releaseDate: { $lte: Date.now() } });
     this.startTime = Date.now();
     next();
});

movieSchema.post(/^find/, function (docs, next) {
     this.find({ releaseDate: { $lte: Date.now() } });
     this.endTime = Date.now();
     const content = `Query took ${this.endTime - this.startTime} milliseconds to fetch documents\n`;

     // Use synchronous writeFileSync method to ensure data is written before continuing
     try {
          fs.writeFileSync('../Data/Database/log.txt', content, { flag: 'a' });
          console.log('Query log saved successfully.');
     } catch (error) {
          console.log('Error saving query log:', error.message);
     }
     next();
});




// Aggregation Middleware
movieSchema.pre('aggregate', function (next) {
     console.log(this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } },

     ));
     next();
})







const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
