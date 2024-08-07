const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const Joi = require("joi");

// Define the schema for user validation
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullname: Joi.string().min(3).required(),
});

const registerUser = async (req, res) => {
  try {
    // Validate the request body against the schema
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      req.flash("error", error.details[0].message);
      return res.redirect("/"); // Redirect to the form page
    }

    const { email, password, fullname } = value;

    let user = await userModel.findOne({ email: email });
    if (user) {
      req.flash("error", "Email already exists");
      return res.redirect("/"); // Redirect to the form page
    }

    // Generate a salt and hash the password
    bcrypt.genSalt(10, async (err, salt) => {
      if (err) {
        req.flash("error", "Internal Server Error");
        return res.redirect("/"); // Redirect to the form page
      }

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          req.flash("error", "Internal Server Error");
          return res.redirect("/"); // Redirect to the form page
        }

        try {
          // Create a new user with the hashed password
          const user = await userModel.create({
            email,
            password: hash,
            fullname,
          });

          // Generate a token and set it in a cookie
          let token = generateToken(user);
          res.cookie("token", token);

          req.flash("success", "User registered successfully");
          return res.redirect("/shop"); // Redirect to a success page
        } catch (err) {
          req.flash("error", "Internal Server Error");
          return res.redirect("/"); // Redirect to the form page
        }
      });
    });
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Internal Server Error");
    res.redirect("/"); // Redirect to the form page
  }
};

const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/"); // Redirect to the login page
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        req.flash("error", "Internal Server Error");
        return res.redirect("/"); // Redirect to the login page
      }

      if (result) {
        let token = generateToken(user);
        res.cookie("token", token);
        req.flash("success", "Logged in successfully");
        return res.redirect("/shop"); // Redirect to the shop or dashboard
      } else {
        req.flash("error", "Invalid email or password");
        return res.redirect("/"); // Redirect to the login page
      }
    });
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Internal Server Error");
    res.redirect("/"); // Redirect to the login page
  }
};

const logoutUser = (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
};

module.exports = { registerUser, loginUser, logoutUser };
