import jwt from "jsonwebtoken";

export const authMiddelware = (req, res, next) => {
    let token = req.cookies.token 

    if(!token) res.status(401).json({message:"Unauthorized User!!"})

    try{
        let secrate_key = process.env.JWT_SECRET_KEY
        let decode = jwt.verify(token, secrate_key )
        req.user = decode
        next()
    }catch{
        return res.status(401).json({ message:"Invalid Token!!"})
    }
}