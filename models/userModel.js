const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        phonenumber:{
            type:Number,
            required:true,
            minlength:5,
            maxlength:10,
            unique:true
        },
        pic:{
            type:String,
            default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },
        dateofbirth:{
            type:String,
        },
        designation:{
            type:String,
        }
    },{
        timestamps:true
    }
);

userSchema.path('phonenumber').validate(function(value) {
    return !isNaN(value);
}, 'Please enter number only');

userSchema.pre("save",async function (next) {
    if (!this.isModified) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

const User = mongoose.model("User",userSchema);

module.exports = User;