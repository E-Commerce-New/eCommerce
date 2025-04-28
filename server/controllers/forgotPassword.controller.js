const User = require('../models/user');
const {sendResetPasswordEmail} = require('../utils/sendMail');
const crypto = require("crypto");

const ForgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(404).json({msg: 'User not found'});

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendResetPasswordEmail(user, token);
        res.json({msg: 'Reset email sent'});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: 'Something went wrong', error});
    }
}

const ResetPassword = async (req, res) => {
    const {token} = req.params;
    const {newPassword} = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {$gt: Date.now()}
    });

    if (!user) return res.status(400).json({msg: 'Invalid or expired token'});

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({msg: 'Password updated successfully'});
}

module.exports = {ForgotPassword , ResetPassword};