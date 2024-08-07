const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model");
const upload = require("../config/multer-config");
const Joi = require("joi");

// Define the Joi schema
const productSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Product name is required",
  }),
  price: Joi.string().required().messages({
    "string.empty": "Product price is required",
  }),
  discount: Joi.string().required().messages({
    "string.empty": "Discount price is required",
  }),
  bgcolor: Joi.string().required().messages({
    "string.empty": "Background color is required",
  }),
  panelcolor: Joi.string().required().messages({
    "string.empty": "Panel color is required",
  }),
  textcolor: Joi.string().required().messages({
    "string.empty": "Text color is required",
  }),
});

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    // Validate the request body against the schema
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      req.flash("error", error.details[0].message);
      return res.redirect("/path-to-your-form"); // Adjust path to your form page
    }

    const { name, price, discount, bgcolor, panelcolor, textcolor } = value;

    let product = await productModel.create({
      image: req.file.buffer,
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
    });

    req.flash("success", "Product created successfully");
    res.redirect("/owners/admin"); // Adjust path to your success page
  } catch (err) {
    console.error(err);
    req.flash("error", "Internal Server Error");
    res.redirect("/"); // Adjust path to your form page
  }
});

module.exports = router;
