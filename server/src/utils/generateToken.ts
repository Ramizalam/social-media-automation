import jwt from "jsonwebtoken";

const generateToken = ({id, email}: {id: string; email: string}): string => {
    return jwt.sign({id,email},process.env.JWT_SECRET || "fallbackString",{
        expiresIn:"30d"
    })
}

export default generateToken