const Follow = require('../models/Follow');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Follow a user
// @route   POST /api/follow
// @access  Private
const followUser = asyncHandler(async (req, res) => {
  const { followingId } = req.body;

  if (followingId === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot follow yourself'
    });
  }

  // Check if user to follow exists
  const userToFollow = await User.findById(followingId);
  if (!userToFollow) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if already following
  const existingFollow = await Follow.findOne({
    follower: req.user.id,
    following: followingId
  });

  if (existingFollow) {
    return res.status(400).json({
      success: false,
      message: 'You are already following this user'
    });
  }

  // Create follow relationship
  const follow = await Follow.create({
    follower: req.user.id,
    following: followingId
  });

  res.status(201).json({
    success: true,
    data: follow
  });
});

// @desc    Unfollow a user
// @route   DELETE /api/follow/:followingId
// @access  Private
const unfollowUser = asyncHandler(async (req, res) => {
  const follow = await Follow.findOne({
    follower: req.user.id,
    following: req.params.followingId
  });

  if (!follow) {
    return res.status(404).json({
      success: false,
      message: 'You are not following this user'
    });
  }

  await follow.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get user's followers
// @route   GET /api/follow/followers/:userId
// @access  Public
const getFollowers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const follows = await Follow.find({ following: req.params.userId })
    .populate({
      path: 'follower',
      select: 'fullName username avatar school branch stats'
    })
    .sort('-followedAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Follow.countDocuments({ following: req.params.userId });

  res.status(200).json({
    success: true,
    count: follows.length,
    total,
    pages: Math.ceil(total / limit),
    data: follows.map(follow => follow.follower)
  });
});

// @desc    Get user's following
// @route   GET /api/follow/following/:userId
// @access  Public
const getFollowing = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const follows = await Follow.find({ follower: req.params.userId })
    .populate({
      path: 'following',
      select: 'fullName username avatar school branch stats'
    })
    .sort('-followedAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Follow.countDocuments({ follower: req.params.userId });

  res.status(200).json({
    success: true,
    count: follows.length,
    total,
    pages: Math.ceil(total / limit),
    data: follows.map(follow => follow.following)
  });
});

// @desc    Check if current user follows another user
// @route   GET /api/follow/check/:userId
// @access  Private
const checkFollowStatus = asyncHandler(async (req, res) => {
  const follow = await Follow.findOne({
    follower: req.user.id,
    following: req.params.userId
  });

  res.status(200).json({
    success: true,
    isFollowing: !!follow
  });
});

// @desc    Get my followers
// @route   GET /api/follow/my/followers
// @access  Private
const getMyFollowers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const follows = await Follow.find({ following: req.user.id })
    .populate({
      path: 'follower',
      select: 'fullName username avatar school branch stats'
    })
    .sort('-followedAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Follow.countDocuments({ following: req.user.id });

  res.status(200).json({
    success: true,
    count: follows.length,
    total,
    pages: Math.ceil(total / limit),
    data: follows.map(follow => follow.follower)
  });
});

// @desc    Get my following
// @route   GET /api/follow/my/following
// @access  Private
const getMyFollowing = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const follows = await Follow.find({ follower: req.user.id })
    .populate({
      path: 'following',
      select: 'fullName username avatar school branch stats'
    })
    .sort('-followedAt')
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Follow.countDocuments({ follower: req.user.id });

  res.status(200).json({
    success: true,
    count: follows.length,
    total,
    pages: Math.ceil(total / limit),
    data: follows.map(follow => follow.following)
  });
});

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  getMyFollowers,
  getMyFollowing
};
