import express from 'express'
const userRoute = express.Router()
import {buyerValidation} from '../middlewares/buyerMiddleware.js'
import {handleAddUser,
    handleLoginUser,
    handleLogoutUser,
    handleSellerDashboard,
    handleForgotPassword,
    handleSendEmail_forgotPassword,
    handleChangePassword,
    handleUpdatePassword,
    handleVerifyAccount,
    handleBecomeSeller,
    handleNewSeller,
    handleGetUserOrders} from '../controllers/handleUser.js'


///// MIDDLEWARES ////
// userRoute.use('/sellerDashboard'||'/reqToBecomeSeller',buyerValidation)


///// ROUTES///
userRoute.post('/register',handleAddUser)
userRoute.post('/login',handleLoginUser)
userRoute.get('/logout',handleLogoutUser)
userRoute.get('/sellerDashboard',handleSellerDashboard)
userRoute.get('/forgotPassword',handleForgotPassword)
userRoute.post('/sendLink',handleSendEmail_forgotPassword)
userRoute.get('/changePassword',handleChangePassword)
userRoute.post('/updatePassword',handleUpdatePassword)
userRoute.get('/verifyAccount',handleVerifyAccount)
userRoute.get('/reqToBecomeSeller',handleBecomeSeller)
userRoute.post('/wantToBeASeller',handleNewSeller)
userRoute.get('/getUserOrders',handleGetUserOrders)
export{userRoute}