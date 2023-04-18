const { Op } = require('sequelize');
const { User, FriendRequests} = require('../model/index');

module.exports.updateProfile = async (req, res) => {
    const { name, email, mobile, address, latitude, longitude } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        const data = await user.update({
            name: name || user.name,
            email: email || user.email,
            mobile: mobile || user.mobile,
            address: address || user.address,
            latitude: latitude || user.latitude,
            longitude: longitude || user.longitude
        });
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports.showProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User Profile.',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports.searchFriend = async (req, res) => {
    const { query } = req.query;
    const userId = req.user.id;
    try {
        const users = await User.findAll({
            where: {
                [Op.and]: [
                    { id: { [Op.ne]: userId } }
                ],
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { phone: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } }
                ]
            }
        });
        if (!users) {
            res.status(200).json({
                success: false,
                message: "friend not found",
                data: users
            });
        }
        res.status(200).json({
            success: true,
            message: "friends list",
            data: users
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: true,
            message: 'Internal server error'
        });
    }
}

module.exports.viewProfileByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        res.status(200).json({
            success: true,
            message: "User Profile is",
            user: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports.sendFriendRequest = async (req, res) => {
    const { friendId } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        const friend = await User.findByPk(friendId);
        if (!friend) {
            return res.status(404).json({
                success: false,
                message: 'Friend not found.'
            });
        }
        if (await FriendRequests.findOne({
            where: {
                requesterid: userId,
                requestid: friendId
            }
        })) {
            return res.status(400).json({
                success: false,
                message: 'Friend request already sent.'
            });
        }
        await FriendRequests.create({
            requesterid: userId,
            requestid: friendId
        });
        res.status(200).json({
            success: true,
            message: 'Friend request sent successfully.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports.friendsList = async (req, res) => {
    const userId = req.user.id;
    console.log(userId);
    try {
        const user = await FriendRequests.findAll(
            {
                where: { requesterid: userId },
                include: [
                    {
                        model: User,
                        as: "requestData"
                    },
                ],
            });
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// update status(approved and rejected)
module.exports.acceptOrRejectRequest = async (req, res) => {
    const { friendId, status } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        const friend = await User.findByPk(friendId);
        if (!friend) {
            return res.status(404).json({
                success: false,
                message: 'Friend not found.'
            });
        }
        await FriendRequests.update({
            status: status
        }, { where: { requesterid: userId } });
        return res.status(200).json({
            success: false,
            message: 'Request updated sucessfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}