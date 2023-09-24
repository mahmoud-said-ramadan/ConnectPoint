import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utilis/errorHandling.js";
import { decryptPhone, doHashing, compare, encrypt, decrypt } from "../../../utilis/Hash-Encrypt.js";
import { generateToken } from "../../../utilis/GenerateAndVerifyToken.js";
import cloudinary from "../../../utilis/cloudinary.js";
import { user } from "../../../../DB/userData.js";
// import { createMail, sendMail } from '../../../utilis/email.js'
// import { deleteDoc } from "../../../utilis/handlers/delete-softDelete.js";

const logOut = async (user) => {
    user.status = 'offline';
    const logOut = await user.save();
    return logOut ? true : false;
}

export const getUserData = asyncHandler(
    async (req, res, next) => {
        const { _id } = req.user;
        let user = await userModel.findById(_id)
            .select('userName image status');
        if (!user) {
            return next(new Error("In-Valid User!", { cause: 401 }));
        }
        user = await decryptPhone(user);
        return res.status(202).json({
            message: "Done!",
            user,
            status: { cause: 202 }
        })
    }
)

export const getAllUsers = asyncHandler(
    async (req, res, next) => {
        let users = await userModel.find()
            .select('-password -confirmEmail');
        users = await decrypt(users);
        return res.status(202).json({
            message: "Done!",
            users,
            status: { cause: 202 }
        })
    }
)

export const changePassword = asyncHandler(
    async (req, res, next) => {
        const { password, _id } = req.user;
        const { oldPassword, newPassword } = req.body;
        const match = compare({ plaintext: oldPassword, hashValue: password });
        if (match) {
            const hashedPassword = doHashing(newPassword);
            await userModel.findByIdAndUpdate({ _id }, { password: hashedPassword, changedAt: Date.now() });
            return res.status(202).json({
                message: "Done!",
                status: { cause: 202 }
            })
        }
        return next(new Error("Wrong Old Password!", { cause: 401 }));
    }
)

export const changeEmail = asyncHandler(
    async (req, res, next) => {
        const protocol = req.protocol;
        const host = req.headers.host;
        const { _id, password } = req.user;
        const { currentPassword, newEmail } = req.body;
        const match = compare({ plaintext: currentPassword, hashValue: password });
        if (match) {
            if (await userModel.findOne({ email: newEmail })) {
                return next(new Error("This email Already Exist!", { cause: 409 }));
            }
            await userModel.findByIdAndUpdate({ _id }, { tempEmail: newEmail });
            //Generate Alternative Token
            const changeEmailToken = generateToken({ email: newEmail, id: _id }, process.env.EMAIL_TOKEN_KEY, 60 * 60 * 24 * 3);
            //Generate unsubscribe Token
            const unsubscribeToken = generateToken({ email: newEmail, id: _id }, process.env.EMAIL_TOKEN_KEY, 60 * 60 * 24 * 3);
            //Generate html form
            const html = createMail({ protocol, host, changeEmailToken, unsubscribeToken });
            //Send Confirmation Mail
            if (!await sendMail({ to: newEmail, subject: "Confirmation E-Mail", html })) {
                return next(new Error("This Email Rejected!", { cause: 400 }));
            }
            return res.status(202).json({
                message: "We Have Sent a confirmation Mail, You have to confirm email in 3 days",
                status: { cause: 202 }
            })
        }
        return next(new Error("Wrong Password!", { cause: 401 }));
    }
)

// Can Update Every Thing Except email And password
export const updateUser = asyncHandler(
    async (req, res, next) => {
        const { _id } = req.user;
        if (req.body?.phone) {
            req.body.phone = encrypt({ value: req.body.phone, encryptionKey: process.env.ENCRYPT_PHONE_KEY }).toString();
        }
        if (req?.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/profile/${req.user.customId}` });
            if (req.user?.image?.public_id) {
                await cloudinary.uploader.destroy(req.user?.image?.public_id);
            }
            req.body.image = { secure_url, public_id };
        }
        const updateUser = await userModel.findByIdAndUpdate(_id, req.body, { new: true });
        return res.status(202).json({
            message: "Done!",
            updateUser,
            status: { cause: 202 }
        });
    }
)

// export const deleteUser = asyncHandler(deleteDoc(userModel));

export const softDeleteUser = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;
        if (await userModel.findByIdAndUpdate(id, { status: 'blocked' })) {
            return res.status(202).json({
                message: "Done!",
                status: { cause: 202 }
            });
        }
        return next(new Error("Fail To DELETE!", { cause: 404 }));
    }
)

export const logOutUser = asyncHandler(
    async (req, res, next) => {
        //send To logOut Fun.
        if (await logOut(req.user)) {
            return res.status(202).json({
                message: "Done!",
                status: { cause: 202 }
            });
        }
        return next(new Error("Fail To logOut!", { cause: 500 }));
    }
)

// export const addFriend = asyncHandler(async (req, res, next) => {
//     const { id } = req.params;
//     const checkUser = await userModel.findById(id);
//     if (!checkUser) {
//         return next(new Error("In-Valid User!", { cause: 404 }));
//     }
//     await userModel.findByIdAndUpdate(req.user._id, { $addToSet: { friends: id } })
//     res.status(202).json({ message: 'Done!' })
// })

// export const addFriend = asyncHandler(async (req, res, next) => {
//     const { id } = req.params;

//     // Find the friend user
//     const friendUser = await userModel.findById(id);
//     if (!friendUser) {
//         return next(new Error("Invalid User!", { cause: 404 }));
//     }

//     const currentUser = req.user;

//     // Update the current user's friends array
//     await userModel.findByIdAndUpdate(
//         currentUser._id,
//         { $addToSet: { friends: { user: friendUser._id } } }
//     );

//     // Update the friend user's friends array
//     await userModel.findByIdAndUpdate(
//         friendUser._id,
//         { $addToSet: { friends: { user: currentUser._id } } }
//     );
//     res.status(202).json({ message: 'Done!' });
// });

export const addFriend = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Find the friend user
    const friendUser = await userModel.findById(id);
    if (!friendUser) {
        return next(new Error("Invalid User!", { cause: 404 }));
    }

    const currentUser = req.user;

    // Update the current user's friends array
    await userModel.findByIdAndUpdate(
        currentUser._id,
        { $addToSet: { friends: { user: friendUser._id, place: 'main' } } }
    );

    // Update the friend user's friends array
    await userModel.findByIdAndUpdate(
        friendUser._id,
        { $addToSet: { friends: { user: currentUser._id, place: 'main' } } }
    );

    res.status(202).json({ message: 'Done!' });
});

export const getFriends = asyncHandler(async (req, res, next) => {
    const friends = await userModel.findById(req.user._id).select('friends').populate({ path: 'friends.user', select: 'userName image' });
    res.status(202).json({ message: 'Done!', friends })
})


export const getUser = () => {
    return user
}