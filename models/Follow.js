const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Follow must have a follower']
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Follow must have someone to follow']
  },
  followedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure a user can only follow another user once
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

// Update follower and following counts when a new follow is created
FollowSchema.post('save', async function() {
  const User = mongoose.model('User');
  
  await User.findByIdAndUpdate(
    this.follower,
    { $inc: { 'stats.following': 1 } }
  );
  
  await User.findByIdAndUpdate(
    this.following,
    { $inc: { 'stats.followers': 1 } }
  );
});

// Update follower and following counts when a follow is removed
FollowSchema.post('remove', async function() {
  const User = mongoose.model('User');
  
  await User.findByIdAndUpdate(
    this.follower,
    { $inc: { 'stats.following': -1 } }
  );
  
  await User.findByIdAndUpdate(
    this.following,
    { $inc: { 'stats.followers': -1 } }
  );
});

module.exports = mongoose.model('Follow', FollowSchema);
