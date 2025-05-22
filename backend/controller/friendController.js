// controller/friendController.js
const User          = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

// Send friend request
exports.sendRequest = async (req,res) => {
  const fromId = req.user.id;
  const { toUsername } = req.body;
  try {
    const toUser = await User.findOne({ username: toUsername });
    if (!toUser) return res.status(404).json({ message: 'User not found' });
    // prevent duplicates
    const exists = await FriendRequest.findOne({ from: fromId, to: toUser._id, status: 'pending' });
    if (exists) return res.status(400).json({ message: 'Request already sent' });
    const fr = new FriendRequest({ from: fromId, to: toUser._id });
    await fr.save();
    res.status(201).json({ message: 'Friend request sent' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

// List incoming requests
exports.listRequests = async (req,res) => {
  const me = req.user.id;
  const requests = await FriendRequest.find({ to: me, status:'pending' }).populate('from','username');
  res.json(requests);
};

// Respond to a request (accept/reject)
exports.respondRequest = async (req,res) => {
  const me = req.user.id;
  const { requestId, action } = req.body; // action = 'accepted' or 'rejected'
  try {
    const reqDoc = await FriendRequest.findOne({ _id: requestId, to: me, status: 'pending' });
    if (!reqDoc) return res.status(404).json({ message:'Request not found' });
    reqDoc.status = action;
    await reqDoc.save();
    if (action === 'accepted') {
      // add each other as friends
      await User.findByIdAndUpdate(me, { $addToSet: { friends: reqDoc.from } });
      await User.findByIdAndUpdate(reqDoc.from, { $addToSet: { friends: me } });
    }
    res.json({ message: `Request ${action}` });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message:'Server error' });
  }
};

// List my friends
exports.listFriends = async (req,res) => {
  const me = req.user.id;
  const user = await User.findById(me).populate('friends','username');
  res.json(user.friends);
};

// View a friend’s cart
const CartItem = require('../models/CartItem');
exports.viewFriendCart = async (req,res) => {
  const me = req.user.id;
  const friendId = req.params.friendId;
  // ensure they’re friends
  const user = await User.findById(me);
  if (!user.friends.includes(friendId)) {
    return res.status(403).json({ message:'Not your friend' });
  }
  const items = await CartItem.find({ user: friendId });
  res.json(items);
};
// Remove a friend
exports.removeFriend = async (req, res) => {
  const me = req.user.id;
  const { friendId } = req.body;

  try {
    if (!friendId) {
      return res.status(400).json({ message: 'Friend ID is required' });
    }

    // Remove friendId from my friends list
    await User.findByIdAndUpdate(me, { $pull: { friends: friendId } });

    // Remove me from friend's friends list
    await User.findByIdAndUpdate(friendId, { $pull: { friends: me } });

    res.json({ message: 'Friend removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

