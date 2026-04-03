const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: [true, 'Rating must be for a note']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rating must be from a user']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: [500, 'Review cannot be more than 500 characters']
  },
  isHelpful: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure a user can only rate a note once
RatingSchema.index({ note: 1, user: 1 }, { unique: true });

// Update note's average rating when a new rating is added
RatingSchema.post('save', async function() {
  const Note = mongoose.model('Note');
  const ratings = await this.constructor.find({ note: this.note });
  
  const averageRating = ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length;
  
  await Note.findByIdAndUpdate(
    this.note,
    { 
      'stats.averageRating': averageRating,
      'stats.totalRatings': ratings.length
    }
  );
});

// Update note's average rating when a rating is removed
RatingSchema.post('remove', async function() {
  const Note = mongoose.model('Note');
  const ratings = await this.constructor.find({ note: this.note });
  
  const averageRating = ratings.length > 0 
    ? ratings.reduce((acc, rating) => acc + rating.rating, 0) / ratings.length 
    : 0;
  
  await Note.findByIdAndUpdate(
    this.note,
    { 
      'stats.averageRating': averageRating,
      'stats.totalRatings': ratings.length
    }
  );
});

module.exports = mongoose.model('Rating', RatingSchema);
