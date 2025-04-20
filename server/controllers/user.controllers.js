const User = require('../models/user');

//Get user by username and password

const getUserByUsernameAndPassword = async(req, res)=>{
    try {
        const {username, password} = req.body;
        let user = await User.findOne({username});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }
        if (user.password === password) {
            res.status(200).json({message: "User Logged In successfully...", user});
        } else {
            res.status(404).json({message: "User Not Found..."})
        }
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({message: "Server error"});
    }
}

const register = async (req, res) => {
    console.log(req.body);
    try {
        const {username, email, password, firstname, lastname, phone, terms} = req.body;

        if (!terms) {
            return res.status(400).json({message: "You must accept terms and conditions"});
        }

        const newUser = new User({
            username,
            email,
            password,
            firstname,
            lastname,
            phone,
        });

        await newUser.save();
        res.status(200).json({message: 'User registered successfully!', user: newUser});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Something went wrong!'});
    }
}


module.exports = {
    getUserByUsernameAndPassword , register
}