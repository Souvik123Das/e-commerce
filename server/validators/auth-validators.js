const {z} = require("zod");

const signupSchema = z.object({
    username : z
    .string({required_error : "Enter Your Name" })
    .trim()
    .min(3, {message:"Name must be at least of 3 chars"}),
})
