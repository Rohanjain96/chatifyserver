const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generateauthtoken } = require("../config/generateAuthtoken.js");
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    let userPassword
    const user = await User.findOne({ phonenumber: phone });
    if (user) {
      userPassword = user.password;
    }
    else {
      throw new Error("Invalid Credentials");
    }
    const match = await bcrypt.compare(password, userPassword)
    if (user && match) {
      const token = generateauthtoken(user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phonenumber: user.phonenumber,
        pic: user.pic,
        token: token,
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(403).send(error.message);
  }

}

const getAllUser = async (req, res) => {
  let keyword;
  if (!req.query.search) {
    keyword = {};
  }
  if (isNaN(req.query.search)) {
    keyword = { name: { $regex: "^" + req.query.search, $options: "i" } }
  }
  else
    keyword = { phonenumber: req.query.search }

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select("-password");
  res.json(users)
}

const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;
    let user
    if (!username || !email || !password || !phone) {
      res.status(400);
      throw new Error("Please Enter all the Feilds");
    }
    const userExists = await User.findOne({ phonenumber: phone });
    if (userExists) {
      res.status(409);
      throw new Error("User already exists");
    }

    user = await User.create({ name: username, email, password, phonenumber: phone });

    const token = generateauthtoken(user._id);

    if (user) {
      res.json(
        {
          _id: user._id,
          name: user.name,
          phonenumber: user.phonenumber,
          email: user.email,
          isadmin: user.isadmin,
          pic: user.picture,
          token: token
        }
      )
    }
    else
      throw new Error("user not created");
  } catch (error) {
    res.status(403).send(error.message)
  }

}

const changePicture = async (req, res) => {
  const { picture } = req.body;
  const updatedData = await User.findByIdAndUpdate(
    req.user._id,
    {
      pic: picture,
    },
    {
      new: true,
    }
  )

  if (!updatedData) {
    res.status(404).json("Profile is not updated");
  } else {
    res.json(updatedData);
  }
};

const updateDetails = async (req, res) => {
  const { name, email, dateofbirth, designation } = req.body;
  let form = { name, email, dateofbirth, designation }
  Object.keys(form).forEach(key => form[key] === undefined && delete form[key])
  const updatedData = await User.findByIdAndUpdate(
    req.user._id, form,
    {
      new: true,
    }
  )

  if (!updatedData) {
    res.status(404).json("Profile is not updated");
  } else {
    res.json(updatedData);
  }
};

const checkcookie = async (req, res) => {
  let token = null
  if (
    req.headers.authorization
  ) {
    token = req.headers.authorization
  }
  if (token !== null) {
    const decoded = jwt.verify(token, process.env.Secret_key);
    data = await User.findById(decoded.userId).select("-password");
    res.json(data);
  }

  else res.status(401).end();
}


module.exports = { login, getAllUser, register, checkcookie, changePicture, updateDetails }