

const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

router.get("/:userId",(req, res, next) => {
    console.log("inside the find by ID")
    const { userId } = req.params;
    User.findById(userId)
      .then((foundUser) => {
        res.status(200).json(foundUser);
        console.log("Got one User By the Id", foundUser);
      })
      .catch((error) => {
        res
          .status(500)
          .json({ message: "error while fetching User By the Id", error });
        console.log("error while fetching User By the Id", error);
        next(err);
      });
  });

  module.exports = router;