const { User } = require('../model/index');
const bcrypt = require('bcrypt')
const { issueJWT, verifyTokenFn1 } = require("../utils/jwt")
const { resetPassMail } = require('../utils/sendMail');

module.exports.signUp = async (req, res) => {
    const { name, email, mobile, password, address, latitude, longitude } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
         await User.create({
            name: name,
            email: email,
            phone: mobile,
            password: hashedPassword,
            address: address,
            latitude: latitude,
            longitude: longitude
        });
        res.status(201).json({
            success: true,
            message: "User created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid email and password'
            });
        }
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(404).json({
                success: false,
                message: 'Invalid email and password'
            });
        }
        const accessToken = await issueJWT(user);
        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            accessToken: accessToken
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid email'
            });
        }
        const otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        await User.update({ otp: otp }, { where: { email: email } });
        await resetPassMail(email, otp, user.name);
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports.resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid email'
            });
        }
        if (user.otp != otp) {
            return res.status(401).json({
                success: false,
                message: 'Invalid OTP.'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPassword });
        res.status(200).json({
            success: true,
            message: 'Password reset successfully.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}

module.exports.refreshJWTToken = async (req, res) => {
    const {token} = req.body;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'token not found.'
        });
    }
    try {
        const decoded = await verifyTokenFn1(req)
        if (!decoded || !decoded.user || !decoded.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        const accessToken = await issueJWT(decoded)
        return res.status(200).json({
            success: true,
            token: accessToken
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}
