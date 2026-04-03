const express = require('express');
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  getMyFollowers,
  getMyFollowing
} = require('../controllers/followController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/')
  .post(protect, followUser);

router.route('/:followingId')
  .delete(protect, unfollowUser);

router.route('/followers/:userId')
  .get(getFollowers);

router.route('/following/:userId')
  .get(getFollowing);

router.route('/check/:userId')
  .get(protect, checkFollowStatus);

router.route('/my/followers')
  .get(protect, getMyFollowers);

router.route('/my/following')
  .get(protect, getMyFollowing);

module.exports = router;
