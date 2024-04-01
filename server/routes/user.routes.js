

const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

router.get("/:userId",(req, res, next) => {
    console.log("inside the find by ID")
    const { userId } = req.params;
    console.log("user id",userId)
    User.findById(userId)
      .then((foundUser) => {
        res.status(200).json(foundUser);
        console.log("Got one User By the Id", foundUser);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "error while fetching User By the Id", err });
        console.log("error while fetching User By the Id", err);
        next(err);
      });
  });

  module.exports = router;