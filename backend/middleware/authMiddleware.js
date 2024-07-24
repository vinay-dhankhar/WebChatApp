const jwt = require("jsonwebtoken");
exports.auth = async(req , res , next) => {
    // console.log(req.headers.authorization);
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token , process.env.JWT_SECRET);
        // console.log(decode);
        req.user = decode;
        next();
    }
    else{
        return res.status(500).json({
            success:false,
            message:"Token not found"
        })
    }
}
