const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// AUTH ROUTES
router.post("/signup", async (req,res) => {
    console.log("signup api call")
    console.log(req.body)
    const { name, email, password } = req.body;
    
    if(email === "" || password === "" || name === ""){
        res.status(400).json({message: "Provide email, password and name"})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if( !emailRegex.test(email)){
        res.status(400).json({message: "Provide a valid email address."})
        return;
    }
    
    // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    })
    return;
  }

  try {
    const foundUser = await UserModel.findOne({ email });
    if (foundUser) {
      res.status(403).json({ message: "email already taken" });
    } else {
      //before creating a user, make sure to hash his or her password
      const mySalt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(password, mySalt);
      const hashedUser = {
        ...req.body,
        password: hashedPassword,
      };

      const myNewUser = await UserModel.create(hashedUser);
      console.log("user created", myNewUser);
      res.status(201).json(myNewUser);
    }
  } catch (err) {
    console.log("error signing up", err);
    res.status(500).json(err);
  }
})


router.post("/login", async (req,res) => {
    const {email, password} = req.body;
    console.log("pre found a user:", req.body);
    try {
        const foundUser = await UserModel.findOne({email});
        console.log("we found a user:", foundUser)
        if (!foundUser) {
            res.status(400).json({
            message:"No user with that email"
            })
        } else {
            const doesPasswortMatch = bcryptjs.compareSync(
                password,
                foundUser.password
            );
            if (!doesPasswortMatch) {
                res.status(400).json({
                    message: "Incorrect password"
                })
            } else {
                const {_id, name} = foundUser
                console.log( "found user ",foundUser)
                const payload = {_id, name}
                console.log( "our payload: ",payload)
                const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {algorithm: "HS256", expiresIn: "6h"})
                res.status(200).json({
                    message: "You successfully logged in",
                    authToken
                })
            }

        }
    } catch (err) {
        console.log("error when logging in", err)
        res.status(500).json({err})
    }
})


router.get("/verify",isAuthenticated, (req, res) => {
    console.log("verify route :", req.payload)
    res.status(200).json(req.payload)    
})

module.exports = router;