const User = require('../models/user');
const jwt = require('jsonwebtoken');

//Get user by username and password

const secretKey = process.env.SECRET_KEY;

const getAllUserName = async (req, res) => {
    const getUsers = await User.find({}, 'username')
    const usernames = getUsers.map(user => user.username)
    return usernames
}

const getUserByUsernameAndPassword = async (req, res) => {
    // console.log(req.body)
    try {
        const {username, password} = req.body;
        let userData = await User.findOne({username, password});
        if (!userData) {
            return res.status(400).json({message: "User not found"});
        }
        if (userData.password === password) {
            //Setting Token
            const token = jwt.sign({
                username: userData.username,
                isAdmin: userData.isAdmin
            }, secretKey, {expiresIn: '120m'});

            const user = {
                username: userData.username,
                isAdmin: userData.isAdmin,
                email: userData.email,
                phone: userData.phone,
                addresses: userData.addresses,
                firstname: userData.firstname,
                lastname: userData.lastname,
                cart: userData.cart,
                _id: userData._id
            }
            //Sending Token to Marketplace as cookie
            res.cookie('access_token', token, {
                httpOnly: true,
                secure: true,
            }).status(200).json({message: "User Logged In successfully...", user});
            console.log(user)
        } else {
            res.status(404).json({message: "User Not Found..."})
        }

    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({message: "Server error"});
    }
}

const getUserById = async (req, res) => {
    if (!req.body) {
        const user = await User.find({})
        res.status(200).json(user);
        return;
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
    try {
        const { username, email, password, firstname, lastname, phone, terms } = req.body;

        if (!terms) {
            return res.status(400).json({ message: "You must accept terms and conditions" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already registered" });
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
        res.status(200).json({ message: 'User registered successfully!', user: newUser });

    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: 'Something went wrong!' });
    }
};

const updateUserProfile = async (req, res) => {
    const {id, addresses, currentPassword, email, firstname, lastname, phone, username} = req.body;
    try {
        if (!id) {
            return res.status(400).json({error: "Missing id"}, 'username');
        } else {
            const userById = await User.findOne({
                $and: [
                    {_id: id},
                    {password: currentPassword}
                ]
            }, 'username password')

            if (!userById) {
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

            const user = {addresses, email, firstname, lastname, phone, username, _id:id};
            await User.findByIdAndUpdate(id, user);

            return res.status(200).json({
                message: 'User updated successfully',
                user
            });
        }
    } catch (error) {
        console.log("ERROR : ", error)
        res.status(500).json({message: 'Internal server error'})
    };
}

const updateUserAddress = async (req, res) => {
    const { id, addresses } = req.body;

    if (!id || !addresses) {
        return res.status(400).json({ message: "User ID and addresses are required" });
    }

    try {
        const user = await User.findByIdAndUpdate(
            id,
            { addresses },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Address updated successfully",
            data: user.addresses
        });
    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    getUserByUsernameAndPassword, register, getUserById, updateUserProfile , updateUserAddress
}