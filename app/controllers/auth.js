// const { sendSMS, sendOTP } = require('../services/otpHelper');
const db = require('../models');
const responseMessages = require('../middlewares/response-messages');
// const { redisAndToken, redisDecodeRefreshToken } = require('../services/redis_token');
const { bcrypt } = require('../services/imports');
const jwtHelper = require('../services/jwt_helper')
// const { isProduction, roleNames, REDIS_SERVER_NOT_CONNECTED } = require('../config/config');
// const { sendNotificationToSelectedUser } = require('./fcm_notification_controller');
// const portalUserModel = require('../models/portalUserModel');
// const { sendEmail } = require('./email_controller');
// const { randomNumber, randomChar } = require('../services/random_number');
// const passwordReset_model = require('../models/passwordReset_model');

// const UserModel = db.user;
// const PortalUserModel = db.portalUser;
const Role = db.role;
const User = db.user
// const MobileOTPModel = db.mobileOTP;
// const ResetPassword = db.resetPassword;

module.exports = {
    // SendOTP: async (req, res) => {
    //     try {
    //         console.log('req.body', req.body);
    //         const { mobile, program } = req.body;

    //         let data = await UserModel.findOne({ mobile, isDeleted: false }, { name: 1 });

    //         const portalUser = await PortalUserModel.findOne({ mobile, isDeleted: false }, { name: 1 });

    //         const randomNumber = Math.floor(100000 + Math.random() * 900000);
    //         const userName = data && data.name ? data.name : 'Student';
    //         // const message = `Dear ${userName}, Your OTP for Dr.M.G.R Center for online program portal is : ${randomNumber}. Don't share with any one - Aim Window`;
    //         const message = `Dear ${userName}, Your OTP for DR MGRERI COP portal is : ${randomNumber}. - Dr.M.G.R Education and Research Institute, Chennai`;
    //         /** SMS SERVICE CODE START */
    //         if (isProduction) {
    //             try {
    //                 const resp = await sendSMS(mobile, message);
    //                 console.log('resp--------------------', resp);
    //                 if (resp.data.status == false || resp.data.code == '007') {
    //                     return res.clientError({ msg: resp.data.description });
    //                 }
    //             } catch (error) {
    //                 console.log('error.status', error);
    //                 if (error.status) {
    //                     if (error.status < 500) {
    //                         return res.clientError({
    //                             ...error.error,
    //                             statusCode: error.status,
    //                         });
    //                     }
    //                     return res.internalServerError({ ...error.error });
    //                 }
    //                 return res.internalServerError({ error });
    //             }
    //         }
    //         /** SMS SERVICE CODE END */
    //         // Get the current date
    //         const mobOTP = await MobileOTPModel.findOneAndUpdate(
    //             { mobile },
    //             { code: randomNumber },
    //             { upsert: true, new: true }
    //         );

    //         if (portalUser) {
    //             return res.success({
    //                 msg: responseMessages['1029'],
    //             });
    //         }

    //         if (!data) {
    //             const findRolesData = await RolesModel.find({ isDeleted: false });
    //             const getAdCounRoles = findRolesData.find((i) => i.name === roleNames.ado);
    //             const getGuestRole = findRolesData.find((i) => i.name === roleNames.gu);
    //             // const getGuestRole = await RolesModel.findOne({ name: roleNames.gu });
    //             console.log('getGuestRole', getGuestRole);
    //             if (!getGuestRole) {
    //                 console.log('no guest role');
    //                 return res.clientError({
    //                     msg: 'Guest Role not found',
    //                 });
    //             }
    //             // lead_id generate some logics added
    //             const currentDate = new Date();
    //             // Get the current month (zero-based index)
    //             let currentMonth = currentDate.getMonth() + 1; // Add 1 to get the month in the range 1-12
    //             // Get the current year
    //             let currentYear = currentDate.getFullYear();
    //             currentMonth = currentMonth.toString().padStart(2, '0');
    //             currentYear %= 100;
    //             const currentFourDigit = `${currentYear}${currentMonth}`;
    //             const findAdo = await PortalUserModel.find({ roles: getAdCounRoles._id.toString() }, { isDeleted: false });
    //             const datas = await UserModel.find();
    //             const assignedAdo = [];
    //             let count = ['1'];
    //             datas.map((val) => {
    //                 if (val.lead_id) {
    //                     const firstFourDigits = val.lead_id.substring(0, 4);
    //                     if (currentFourDigit == firstFourDigits) {
    //                         count.push(val.lead_id);
    //                     }
    //                 }
    //                 assignedAdo.push(val.ad_counselor?.toString());
    //             });
    //             const newAdo = findAdo.filter((value) => !assignedAdo.includes(value._id.toString()));
    //             let ad_counselor = newAdo[0]?._id.toString();
    //             if (!newAdo.length) {
    //                 const same = [];
    //                 datas.map((value) => {
    //                     findAdo.find((ado) => {
    //                         if (ado._id.toString() == value.ad_counselor?.toString()) {
    //                             same.push(ado._id.toString());
    //                         }
    //                     });
    //                 });
    //                 const nonDuplicateValues = same.filter(
    //                     (value, index, self) => self.indexOf(value) === self.lastIndexOf(value)
    //                 );
    //                 if (!nonDuplicateValues.length) {
    //                     function getSmallestDuplicateInfo(array) {
    //                         const counts = {};

    //                         for (const value of array) {
    //                             if (counts[value]) {
    //                                 counts[value]++;
    //                             } else {
    //                                 counts[value] = 1;
    //                             }
    //                         }
    //                         const duplicateLengths = Object.values(counts).filter((count) => count > 1);
    //                         const smallestDuplicateLength = Math.min(...duplicateLengths);

    //                         if (smallestDuplicateLength) {
    //                             const smallestDuplicateValue = Object.keys(counts).find(
    //                                 (key) => counts[key] === smallestDuplicateLength
    //                             );
    //                             return { length: smallestDuplicateLength, value: smallestDuplicateValue };
    //                         }
    //                         return { length: 0, value: null };
    //                     }
    //                     console.log('cout-lenfrtgh---', same.length);
    //                     console.log('newAdo length----', newAdo.length);
    //                     // Example usage
    //                     // const array = [1, 2, 3, 2, 4, 3, 5, 6, 1];
    //                     const smallestDuplicateInfo = getSmallestDuplicateInfo(same);
    //                     console.log('Smallest duplicate length:', smallestDuplicateInfo.length);
    //                     console.log('Smallest duplicate value:', smallestDuplicateInfo.value);
    //                     ad_counselor = smallestDuplicateInfo.value;
    //                 } else {
    //                     ad_counselor = nonDuplicateValues[0];
    //                 }
    //             }
    //             console.log('------------------', ad_counselor);
    //             count = count.length;
    //             const paddedNumber = count.toString().padStart(4, '0');
    //             const lead_id = `${currentFourDigit}${paddedNumber}`;
    //             const value = {
    //                 mobile,
    //                 roles: [getGuestRole._id.toString()],
    //                 lead_id,
    //                 ad_counselor: '647b010a3051bf498e0ae8e1',
    //             };
    //             if (program) value.program = program;
    //             data = await UserModel.create(value);
    //             console.log('data------', data);
    //         }
    //         if (data && data._id) {
    //             return res.success({
    //                 msg: responseMessages['1007'],
    //             });
    //         }
    //         return res.clientError({
    //             msg: 'Something went wrong',
    //         });
    //     } catch (error) {
    //         console.log('error.status', error);
    //         if (error.status) {
    //             if (error.status < 500) {
    //                 return res.clientError({
    //                     ...error.error,
    //                     statusCode: error.status,
    //                 });
    //             }
    //             return res.internalServerError({ ...error.error });
    //         }
    //         return res.internalServerError({ error });
    //     }
    // },
    // VerifyOTP: async (req, res) => {
    //     try {
    //         const { mobile, otp, device_id, fcm_token, ip } = req.body;

    //         const checkExists = await UserModel.findOne({ mobile, isDeleted: false })
    //             .populate('roles', 'name permissions')
    //             .populate('ad_counselor', 'name email mobile firstName lastName');

    //         const checkPortalUser = await PortalUserModel.findOne({ mobile, isDeleted: false }).populate(
    //             'roles',
    //             'name permissions firstName lastName'
    //         );
    //         console.log('checkExist-------', checkExists);
    //         if (!checkExists && !checkPortalUser) {
    //             return res.clientError({
    //                 msg: 'Mobile number doesnot exists',
    //             });
    //         }

    //         if (isProduction) {
    //             const checkExistsMobile = await MobileOTPModel.findOne({ mobile, code: otp });
    //             const correctOtp = '123456';
    //             const fullNumber = mobile;
    //             const lastSixDigits = fullNumber.slice(-6);
    //             console.log('lastsixdigit--------', lastSixDigits);
    //             if (!checkExistsMobile && correctOtp != '123456' && !lastSixDigits) {
    //                 return res.clientError({ msg: responseMessages['1009'] });
    //             }
    //         } else if (otp !== '123456') {
    //             return res.clientError({ msg: responseMessages['1009'] });
    //         }

    //         if (device_id && fcm_token) {
    //             await db.fcm.deleteOne({ user_id: checkExists._id.toString() });
    //             await db.fcm.create({ user_id: checkExists._id.toString(), fcm_token, device_id });
    //         }

    //         if (checkExists?.studentEnrollement === false) {
    //             let { ad_counselor } = checkExists;

    //             let roleType = roleNames.gu;
    //             let roleId = '';

    //             const findRolesData = await RolesModel.find({ isDeleted: false });
    //             console.log('findRolesData', findRolesData);
    //             if (!checkExists.roles.length) {
    //                 const getGuestRole = findRolesData.find((i) => i.name === roleNames.gu);
    //                 // const getGuestRole = await RolesModel.findOne({ name: 'GUEST' });
    //                 roleId = getGuestRole._id;
    //             } else {
    //                 const getActualRole = findRolesData.find((i) => i._id.toString() == checkExists.roles[0]._id.toString());
    //                 // const getActualRole = await RolesModel.findOne({ _id: checkExists.roles[0] });
    //                 roleType = getActualRole.name;
    //                 roleId = getActualRole._id;
    //             }
    //             const userUpdData = { mobileVerified: true };
    //             console.log('checkExists.ad_counselor', checkExists.ad_counselor);
    //             if (!checkExists.ad_counselor) {
    //                 const getAdCounRoles = findRolesData.find((i) => i.name === roleNames.ado);
    //                 console.log('getAdCounRoles', getAdCounRoles);
    //                 const getAdCounselor = await PortalUserModel.findOne({ roles: [getAdCounRoles._id] });
    //                 console.log('getAdCounselor', getAdCounselor);
    //                 userUpdData.ad_counselor = getAdCounselor._id;
    //                 ad_counselor = {
    //                     name: getAdCounselor.name,
    //                     email: getAdCounselor.email,
    //                     mobile: getAdCounselor.mobile,
    //                     firstName: getAdCounselor.firstName,
    //                     lastName: getAdCounselor.lastName,
    //                 };
    //             }
    //             const data = await UserModel.updateOne({ _id: checkExists._id }, userUpdData);

    //             if (data && data.modifiedCount) {
    //                 /** TOKEN GENERATION START */
    //                 const tokens = await redisAndToken(checkExists._id.toString(), device_id, ip, roleType, roleId);
    //                 // checkExists = await UserModel.findOne({ mobile });
    //                 // console.log('checkExists', checkExists);
    //                 const resultObj = { tokens };
    //                 resultObj.user = checkExists;
    //                 resultObj.user = { ...resultObj.user._doc };
    //                 resultObj.user.mobileVerified = true;
    //                 resultObj.user.roleType = roleType;
    //                 resultObj.user.ad_counselor = ad_counselor;
    //                 if (resultObj.user.password) delete resultObj.user.password;
    //                 await MobileOTPModel.deleteOne({ mobile });
    //                 return res.success({ msg: responseMessages['1010'], result: resultObj });
    //             }
    //         } else {
    //             console.log('user_id------------------------------------------------');
    //             // if guest user fails we consider the user as portal and we create a token
    //             const getRoleId = checkPortalUser.roles[0];
    //             const tokens = await redisAndToken(
    //                 checkPortalUser._id.toString(),
    //                 device_id,
    //                 ip,
    //                 getRoleId.name,
    //                 checkPortalUser.roles[0].toString()
    //             );
    //             const resultObj = { tokens };
    //             resultObj.user = checkPortalUser;
    //             console.log('resultObj.user', resultObj.user);
    //             resultObj.user = { ...resultObj.user._doc };
    //             resultObj.user.roleType = getRoleId.name;

    //             resultObj.user = checkPortalUser;
    //             console.log('resultObj.user', resultObj.user);
    //             resultObj.user = { ...resultObj.user._doc };
    //             resultObj.user.roleType = getRoleId.name;
    //             console.log('resultObj.user', resultObj.user);
    //             if (resultObj.user.password) delete resultObj.user.password;
    //             await MobileOTPModel.deleteOne({ mobile });
    //             return res.success({ msg: responseMessages['1030'], result: resultObj });
    //         }
    //     } catch (error) {
    //         if (error.status) {
    //             if (error.status < 500) {
    //                 return res.clientError({
    //                     ...error.error,
    //                     statusCode: error.status,
    //                 });
    //             }
    //             return res.internalServerError({ ...error.error });
    //         }
    //         return res.internalServerError({ error });
    //     }
    // },
    signup: async (req, res) => {
        try {
            console.log('siginup---------');
            console.log('req.body---', req.body);
            const filterArray = [{ mobile: req.body.mobile }];
            if (req.body.email) filterArray.push({ email: req.body.email });
            const checkExists = await User.findOne({ $or: filterArray });
            console.log('check exist-------', checkExists);
            if (checkExists) {
                return res.clientError({ msg: responseMessages[1014] });
            };
            const checkRoleExists = await Role.findOne({ _id: req.body.role, isDeleted: false });
            if (!checkRoleExists) return res.clientError({ msg: 'Invalid Role' });
            console.log('data---', checkRoleExists);
            if (checkRoleExists && checkRoleExists._id) req.body.role = checkRoleExists._id.toString();
            req.body.password = await bcrypt.hashSync(req.body.password, 8);
            req.body.userName = req.body.email;
            const data = await User.create(req.body);
            console.log('data---', data);
            if (data && data._id) {
                return res.success({
                    result: data,
                    msg: 'User Created successfully!!!',
                });
            }
            return res.clientError({
                msg: 'User creation failed',
            });
        } catch (error) {
            console.log('\n user save error...', error);
            if (error.status) {
                if (error.status < 500) {
                    return res.clientError({
                        ...error.error,
                        statusCode: error.status,
                    });
                }
                return res.internalServerError({ ...error.error });
            }
            return res.internalServerError({ error });
        }
    },
    signin: async (req, res) => {
        try {
            console.log('signin-------');
            const { email, password, device_id, fcm_token, ip } = req.body;
            const checkExists = await User.findOne({ $or: [{ email, }, { mobile: email }] }).populate('role', 'name permissions');
            console.log('chexkexist-----', checkExists);
            if (!checkExists) return res.clientError({ msg: responseMessages[1009] });
            // if (!device_id && !ip) return res.clientError({ msg: 'Device id or ip is required' });
            const passwordIsValid = bcrypt.compareSync(password, checkExists.password);
            if (!passwordIsValid) {
                return res.clientError({ msg: responseMessages[1009] });
            }
            console.log('chexkexist-----368',);
            // if (device_id && fcm_token) {
            //     await db.fcm.deleteOne({ user_id: checkExists._id.toString() });
            //     await db.fcm.create({ user_id: checkExists._id.toString(), fcm_token, device_id });
            // }
            const getRoleId = checkExists.role;
            console.log('chexkexist-----374',);
            const payload = {
                user_id: checkExists._id.toString(),
                role: checkExists.role.name
            };

            /** TOKEN GENERATION START */
            // const tokens = await redisAndToken(
            //     checkExists._id.toString(),
            //     device_id,
            //     ip,
            //     getRoleId.name,
            //     checkExists.role._id.toString()
            // );
            const token = await jwtHelper.signAccessToken(payload)
            console.log('chexkexist-----383',);
            const resultObj = { token };
            resultObj.user = checkExists;
            resultObj.user = { ...resultObj.user._doc };
            resultObj.user.roleType = getRoleId.name;

            resultObj.user = checkExists;
            resultObj.user = { ...resultObj.user._doc };
            resultObj.user.roleType = getRoleId.name;
            if (resultObj.user.password) delete resultObj.user.password;
            return res.success({ msg: 'Logged in Successfully!!!', result: resultObj });
        } catch (error) {
            if (error.status) {
                if (error.status < 500) {
                    return res.clientError({
                        ...error.error,
                        statusCode: error.status,
                    });
                }
                return res.internalServerError({ ...error.error });
            }
            return res.internalServerError({ error });
        }
    },
    // whatsAppSignin: async (req, res) => {
    //     try {
    //         const { mobile } = req.body;
    //         const findQuery = { isDeleted: false };
    //         findQuery.mobile = mobile;
    //         const checkUser = await UserModel.findOne(findQuery);
    //         if (checkUser) {
    //             return res.success({
    //                 result: checkUser,
    //                 msg: `${mobile} he is a users`,
    //             });
    //         }
    //         return res.clientError({
    //             msg: `${mobile} he is a new user please logged in`,
    //         });
    //     } catch (error) {
    //         console.log('error', error);
    //         if (error.status) {
    //             if (error.status < 500) {
    //                 res.clientError({
    //                     ...error.error,
    //                     statusCode: error.status,
    //                 });
    //             } else {
    //                 res.internalServerError({ ...error.error });
    //             }
    //         } else {
    //             res.internalServerError({ error });
    //         }
    //     }
    // },

    // logoutUser: async (req, res) => {
    //     try {
    //         const { device_id, ip } = req.body;

    //         if (!device_id && !ip) {
    //             res.clientError({
    //                 msg: 'Invalid device',
    //             });
    //         }

    //         const { user_id } = req.decoded;

    //         const foundTokens = await redisDecodeRefreshToken(user_id, device_id, ip);

    //         if (foundTokens.length) {
    //             await db.fcm.deleteOne({ user_id });
    //             res.ok({
    //                 msg: 'Logged out Successfully!!!',
    //             });
    //         } else {
    //             res.clientError({
    //                 msg: 'Bad Request : Invalid data provided.',
    //             });
    //         }
    //     } catch (error) {
    //         if (error.status) {
    //             if (error.status < 500) {
    //                 return res.clientError({
    //                     ...error.error,
    //                     statusCode: error.status,
    //                 });
    //             }
    //             return res.internalServerError({ ...error.error });
    //         }
    //         return res.internalServerError({ error });
    //     }
    // },
    // fcmNotification: async (req, res) => {
    //     try {
    //         const { user_identity } = req.body;

    //         const filterArray = [{ mobile: user_identity }, { email: user_identity }];
    //         const checkExists = await PortalUserModel.findOne({ $or: filterArray });
    //         if (checkExists) {
    //             req.body.user_ids = [checkExists._id.toString()];
    //             await sendNotificationToSelectedUser(req, res);
    //             res.ok({
    //                 msg: 'Logged out Successfully!!!',
    //             });
    //         } else {
    //             res.clientError({
    //                 msg: 'User not found',
    //             });
    //         }
    //     } catch (error) {
    //         if (error.status) {
    //             if (error.status < 500) {
    //                 return res.clientError({
    //                     ...error.error,
    //                     statusCode: error.status,
    //                 });
    //             }
    //             return res.internalServerError({ ...error.error });
    //         }
    //         return res.internalServerError({ error });
    //     }
    // },

    changePassword: async (req, res) => {
        try {
            console.log('change password');
            const { user_id } = req.decoded;
            const filterQuery = { isDeleted: false };
            filterQuery._id = user_id;
            const user = await User.findOne(filterQuery);
            if (!user) {
                return res.clientError({
                    msg: 'user not found'
                });
            }
            const { oldPassword } = req.body;
            const checkPsw = bcrypt.compareSync(oldPassword, user.password);
            if (!checkPsw) {
                return res.clientError({
                    msg: 'old password is incorect'
                });
            }
            const password = req.body.newPassword;
            const hashedNewPassword = await bcrypt.hashSync(password, 8);
            await User.updateOne({ _id: user_id }, { $set: { password: hashedNewPassword } });
            //  user.password = hashPassword
            // await user.save()
            return res.success({
                msg: 'password change succesfully'
            });
        } catch (error) {
            if (error.status) {
                if (error.status < 500) {
                    return res.clientError({
                        ...error.error,
                        statusCode: error.status,
                    });
                }
                return res.internalServerError({ ...error.error });
            }
            return res.internalServerError({ error });
        }
    },

    // forgotPassword: async (req, res) => {
    //     try {
    //         const { value } = req.body;
    //         // const filterQuery = { isDeleted: false };
    //         // if(value)filterQuery.email = value;
    //         // if(value)filterQuery.mobile = value;
    //         const existsUser = await PortalUserModel.findOne({ $or: [{ email: value, }, { mobile: value }], isDeleted: false });
    //         console.log('existUser', existsUser);

    //         if (!existsUser) {
    //             return res.clientError({
    //                 msg: 'Invalid Email or Mobile'
    //             });
    //         }
    //         const myDate = new Date();
    //         myDate.setHours(myDate.getHours() + 1);
    //         console.log('myDate--------', myDate);

    //         if (existsUser.email === value) {
    //             console.log('if------------------');
    //             const resetUserPassword = {
    //                 email: value,
    //                 user_id: existsUser._id.toString(),
    //                 verification_id: randomChar(80),
    //                 expiresOn: myDate,
    //             };
    //             const resetToken = resetUserPassword.verification_id;

    //             const checkExist = await ResetPassword.findOne({ user_id: existsUser._id.toString() });
    //             if (checkExist) {
    //                 await ResetPassword.deleteOne({ _id: checkExist._id });
    //             }
    //             const response = await ResetPassword.create(resetUserPassword);
    //             if (response) {
    //                 const resetUrl = `${req.protocol}://${req.get('host')}/reset/password?token=${resetToken}`;
    //                 console.log('resetUrl------------', resetUrl);

    //                 const text = `your password reset url is as fallows \n\n 
    //       ${resetUrl}\n\n if you have not requested this email, than ignored it`;
    //                 const subject = 'Password Reset Request';

    //                 const emailTemData = await sendEmail(value, subject, text);

    //                 return res.success({
    //                     msg: 'Email Sent Successfully:',
    //                     result: emailTemData
    //                 });
    //             }
    //         } else {
    //             const resetUserPassword = {
    //                 mobile: value,
    //                 user_id: existsUser._id.toString(),
    //                 expiresOn: myDate,
    //                 otp: randomNumber(6)
    //             };
    //             const OTP = resetUserPassword.otp;
    //             console.log('resetOTP', OTP);

    //             const checkExist = await ResetPassword.findOne({ user_id: existsUser._id.toString() });
    //             if (checkExist) {
    //                 await ResetPassword.deleteOne({ _id: checkExist._id });
    //             }
    //             const response = await ResetPassword.create(resetUserPassword);
    //             if (response) {
    //                 // const message = `your reset password otp is ${OTP}`;
    //                 const text = 'user your forgot password otp is';
    //                 const message = `Dear ${text}, Your OTP for DR MGRERI COP portal is : ${OTP}. - Dr.M.G.R Education and Research Institute, Chennai`;

    //                 const otpSend = await sendSMS(value, message);
    //                 const checkotp = await sendOTP(value);
    //                 console.log('---------------', checkotp);
    //                 if (otpSend.data.status == false || otpSend.data.code == '007') {
    //                     return res.clientError({ msg: otpSend.data.description });
    //                 }
    //                 return res.success({
    //                     msg: 'otp Sent Successfully',
    //                     result: otpSend.data
    //                 });
    //             }
    //         }
    //     } catch (error) {
    //         if (error.status) {
    //             if (error.status < 500) {
    //                 return res.clientError({
    //                     ...error.error,
    //                     statusCode: error.status,
    //                 });
    //             }
    //             return res.internalServerError({ ...error.error });
    //         }
    //         return res.internalServerError({ error });
    //     }
    // },

    // resetVerify: async (req, res, next) => {
    //     try {
    //         const { value, otp } = req.body;
    //         const { token } = req.params;
    //         const existsUser = await PortalUserModel.findOne({ $or: [{ email: value, }, { mobile: value }], isDeleted: false });
    //         if (!existsUser) {
    //             return res.clientError({
    //                 msg: 'Invalid Email or Mobile'
    //             });
    //         }
    //         // if (existsUser.email == value) {
    //         //   const userId = existsUser._id.toString();
    //         //   const findQuery = { user_id: userId, verification_id: token, expiresOn: { $gt: Date.now() } };
    //         //   const response = await ResetPassword.findOne(findQuery);
    //         //   if (response) {
    //         //     const update = await ResetPassword.updateOne({ _id: response._id }, { isVerified: true });
    //         //     if (update.modifiedCount) {
    //         //       return res.success({
    //         //         msg: 'Verified successfully, please reset your password'
    //         //       });
    //         //     }
    //         //   } else {
    //         //     return res.clientError({
    //         //       msg: ' Reset Password Link Invalid or Expired '
    //         //     });
    //         //   }
    //         // }
    //         if (existsUser.mobile == value) {
    //             const userId = existsUser._id.toString();
    //             const findQuery = { user_id: userId, otp, expiresOn: { $gt: Date.now() } };
    //             const response = await ResetPassword.findOne(findQuery);
    //             if (response) {
    //                 const update = await ResetPassword.updateOne({ _id: response._id }, { isVerified: true });
    //                 if (update.modifiedCount) {
    //                     return res.success({
    //                         msg: 'Verified successfully, please reset your password'
    //                     });
    //                 }
    //             } else {
    //                 return res.clientError({
    //                     msg: ' Reset Password OTP Invalid or Expired '
    //                 });
    //             }
    //         }
    //     } catch (error) {
    //         if (error.status) {
    //             if (error.status < 500) {
    //                 return res.clientError({
    //                     ...error.error,
    //                     statusCode: error.status,
    //                 });
    //             }
    //             return res.internalServerError({ ...error.error });
    //         }
    //         return res.internalServerError({ error });
    //     }
    // },

    // resetPassword: async (req, res) => {
    //     try {
    //         const { value, password, confirmPassword } = req.body;
    //         const { token } = req.params;
    //         const existsUser = await PortalUserModel.findOne({ $or: [{ email: value, }, { mobile: value }], isDeleted: false });
    //         if (!existsUser) {
    //             return res.clientError({
    //                 msg: 'Invalid Email or Mobile'
    //             });
    //         }
    //         if (existsUser.email == value) {
    //             const userId = existsUser._id.toString();
    //             const findQuery = { user_id: userId, verification_id: token, expiresOn: { $gt: Date.now() } };
    //             const response = await ResetPassword.findOne(findQuery);
    //             if (response) {
    //                 await ResetPassword.updateOne({ _id: response._id }, { isVerified: true });
    //             } else if (!response) {
    //                 return res.clientError({
    //                     msg: ' Reset Password Link Invalid or Expired '
    //                 });
    //             }
    //         }
    //         const checkVerified = await ResetPassword.findOne({ user_id: existsUser._id });
    //         if (checkVerified.isVerified == false) {
    //             return res.clientError({
    //                 msg: 'Kindly check verify to reset your password'
    //             });
    //         }
    //         if (password != confirmPassword) {
    //             return res.clientError({
    //                 msg: 'password and confirmPassword donot match'
    //             });
    //         }
    //         const hashedNewPassword = await bcrypt.hashSync(password, 8);
    //         const update = await PortalUserModel.updateOne({ _id: existsUser._id }, { password: hashedNewPassword });
    //         if (update.modifiedCount) {
    //             checkVerified.otp = undefined;
    //             checkVerified.verification_id = undefined;
    //             checkVerified.isVerified = false;
    //             await checkVerified.save({ validateBeforeSave: false });

    //             return res.success({
    //                 msg: 'Password Reset Successfully'
    //             });
    //         }
    //         return res.clientError({
    //             msg: 'Password Reset Failed'
    //         });
    //     } catch (error) {
    //         if (error.status) {
    //             if (error.status < 500) {
    //                 return res.clientError({
    //                     ...error.error,
    //                     statusCode: error.status,
    //                 });
    //             }
    //             return res.internalServerError({ ...error.error });
    //         }
    //         return res.internalServerError({ error });
    //     }
    // }

};
