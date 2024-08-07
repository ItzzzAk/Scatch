const express = require("express");
const ownerModal = require("../models/owners-model");
const router = express.Router();

if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    let owners = await ownerModal.find();
    if (owners.length > 0) {
      return res
        .status(502)
        .send("You dont have permissions to create a new owner");
    }

    let { fullname, email, password } = req.body;

   let createdOwner =  await ownerModal.create({
      fullname,
      email,
      password,
    });

    res.send(createdOwner);
  });
}
router.get("/admin", (req, res) => {
 let success =  req.flash("success")
  res.render("createproducts");
});

module.exports = router;
