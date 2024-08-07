
const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

const isLoggedIn = async (req, res, next) => {
  if (!req.cookies.token) {
    req.flash('error', 'You must be logged in');
    return res.redirect('/');
  }

  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    const user = await userModel.findOne({ email: decoded.email }).select('-password');
    req.user = user;
    next();
  } catch (error) {
    req.flash('error', 'Something went wrong');
    res.redirect('/');
  }
};




module.exports = isLoggedIn;
