const User = require("../models/user-model");
const bcrypt = require("bcryptjs");



const home = async(req,res) => {
    try{
        res
        .status(200)
        .send("welcome ");
    } 
    catch(error){
        console.log(error);
    }
};

const register = async(req,res) => {
    try{
        console.log(req.body);
        const {username,email,phone,password} = req.body;
        
        const userExist = await User.findOne({email});

        if(userExist){
            console.log("User already exists");
            return res.status(400).json({msg: "Email already exists"});
        }

        const saltRound =10;
        const hash_password = await bcrypt.hash(password, saltRound);
        


        const usercreated = await User.create({username,email,phone,password:hash_password });

        res.status(200).json({msg : usercreated, token : await usercreated.genaratetoken(), userId:usercreated._id.toString(), });
    }catch (error){
        res.status(404).json({msg:"page not found"})
    }
};

const login = async(req,res) => {
    try {
        const {email ,password } =req.body;

        const userExist =await User.findOne({email});
        console.log(userExist);
        if(!userExist){
            return res.status(400).json({message : "Invalid Credentials"});
        }
        const user =await bcrypt.compare(password,userExist.password);

        if(user){
            res.status(200).json({msg : "Login Successful ", token : await userExist.genaratetoken(), userId:userExist._id.toString(), });
        }else{
            res.status(401).json({message:"Invalid Email or Password"});
        }

    } catch (error) {
        res.status(500).json("internal server error");
    }
}

module.exports = {home , register,login };