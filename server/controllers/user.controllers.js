const User = require('../models/user');
const jwt = require('jsonwebtoken');

//Get user by username and password

const secretKey = process.env.SECRET_KEY;

const getAllUserName = async () => {
    const getUsers = await User.find({}, 'username')
    const usernames = getUsers.map(user => user.username)
    return usernames
}

const getUserByUsernameAndPassword = async (req, res) => {
    // console.log(req.body)
    try {
        const {username, password} = req.body;
        let user = await User.findOne({username});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }
        if (user.password === password) {
            //Setting Token
            const token = jwt.sign({
                username: user.username
            }, secretKey, {expiresIn: '30m'});
            //Sending Token to client as cookie
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: true,
            }).status(200).json({message: "Useer Logged In successfully...", user, token});
            // console.log(token)
        } else {
            res.status(404).json({message: "User Not Found..."})
        }

    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({message: "Server error"});
    }
}

const getUser = async (req, res) => {
    if (!req.user) {
        const user = await User.find({})
        const totalUsers = user.length
        res.status(200).json(totalUsers);
    }

    try {
        const {id} = req.body;

        if (!id) {
            return res.status(400).json({message: "User ID is required."});
        }

        const user = await User.findOne({_id: id});

        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        res.status(200).json({message: "User fetched successfully", data: user});
    } catch (error) {
        console.error("Error in getUser:", error);
        res.status(500).json({message: "Server error"});
    }
};

const register = async (req, res) => {
    // console.log(req.body);
    try {
        const {username, email, password, firstname, lastname, phone, terms} = req.body;

        if (!terms) {
            return res.status(400).json({message: "You must accept terms and conditions"});
        }

        const usernames = await getAllUserName()

        if (usernames.includes(username)) {
            console.log("true haha...")
            return res.status(400).json({message: "Username already exists"})
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

const addToCart = async (req, res) => {
    const {userId, productId} = req.body;
    // console.log(req.body)
    if (!userId || !productId) {
        return res.status(400).json({error: "Missing userId or productId"});
    }

    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({error: 'User not found'});

        const existingProduct = user.cart.find(item => item.productId.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            user.cart.push({productId});
        }

        await user.save();

        return res.status(200).json({message: 'Product added to cart', cart: user.cart});
    } catch (err) {
        console.error("ERROR ", err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

const updateUserProfile = async (req, res) => {
    const {id, addresses, currentPassword, email, firstname, lastname, phone, username} = req.body;
    try {
        if (!id) {
            return res.status(400).json({error: "Missing id"}, 'username');
        } else {
            const userById = await User.findOne({
                $and: [
                    { _id:id },
                    { password: currentPassword }
                ]
            }, 'username password')

            if(!userById){
                return res.status(400).json({message: "Incorrect Password"})
            }
            //Verifying Password
            console.log(userById)

            //Verifying username
            if (userById.username !== username) {
                const usernames = await getAllUserName()
                if (usernames.includes(username)) {
                    return res.status(400).json({message: "Username already exists"})
                }
            }

            const user = {addresses, email, firstname, lastname, phone, username}
            await User.findByIdAndUpdate(id, user)

            return res.status(200).json({
                message: 'User updated successfully',
                data: {id, addresses, currentPassword, email, firstname, lastname, phone, username}
            });
        }
    } catch (error) {
        console.log("ERROR : ", error)
        res.status(500).json({message: 'Internal server error'})
    }
}

module.exports = {
    getUserByUsernameAndPassword, register, addToCart, getUser, updateUserProfile
}