const jwt = require("jsonwebtoken");

const generateauthtoken = (userId)=>{

        return jwt.sign({userId},process.env.Secret_key,{
            expiresIn:"30d",
        });
}

module.exports = {generateauthtoken};