const express = require("express");
const router = express.Router();

const { login, getAllUser, register,checkcookie,changePicture,updateDetails } = require("../controllers/userController.js");
const { protect } = require("../Middleware/Autheticate.js");

router.post("/register", register);

router.post("/login", login);

router.get("/allusers", protect, getAllUser);

router.patch("/changePicture", protect, changePicture);

router.patch("/updateDetail", protect, updateDetails);

router.get("/checkcookie", checkcookie);


module.exports = router;