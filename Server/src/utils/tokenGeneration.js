import jwt from 'jsonwebtoken'

export const tokenGeneration = (payload) => {
    let secretKey = process.env.JWT_SECRET_KEY
    let token = jwt.sign(payload, secretKey, { expiresIn: "1h" }) // This is a placeholder, you would use a real secret key and configure token options as needed

    return token
}