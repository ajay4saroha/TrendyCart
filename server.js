//////////// PACKAGES //////////////
import express, { urlencoded } from 'express'
import ejs from 'ejs'
import nodemailer from 'nodemailer'
import { createSession } from './middlewares/createSession.js'
import jwt from 'jsonwebtoken'
import { connect, connectDB } from './database.js'
import { homeRoute } from './routes/homeroute.js'
import { validate } from './middlewares/validReqBody.js'
import { userRoute } from './routes/userRoute.js'
import { sellerRoute } from './routes/sellerRoute.js'
import { productRoute } from './routes/productRoute.js'
import { adminRoute } from './routes/adminRoute.js'
import { orderRoute } from './routes/orderRoute.js'
import { distributerRoute } from './routes/distributorRoute.js'
////////// SERVER CONFIGURATION /////////
const app = express()
const PORT = 4000
app.set('view engine','ejs')

//////// MIDDLEWARES //////////
app.use(createSession)
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public/'))
// app.use('/register',validate)

//////// USER ROUTES ///////////

app.post('/register',userRoute)
app.post('/login',userRoute)
app.get('/logout',userRoute)
app.get('/sellerDashboard',userRoute)
app.get('/forgotPassword',userRoute)
app.post('/sendLink',userRoute)
app.get('/changePassword',userRoute)
app.post('/updatePassword',userRoute)
app.get('/verifyAccount',userRoute)
app.get('/reqToBecomeSeller',userRoute)
app.post('/wantToBeASeller',userRoute)
app.get('/getUserOrders',userRoute)


///////// SELLER ROUTES ////////////
app.post('/addNewProduct',sellerRoute)
app.get('/listedProducts',sellerRoute)
app.post('/updateProductDetails',sellerRoute)
app.post('/insertNewProductDetails',sellerRoute)
app.post('/deleteProduct',sellerRoute)
app.get('/getSellerOrders',sellerRoute)
app.post('/dispatchOrder',sellerRoute)



////////// ADMIN ROUTE ////////
app.get('/adminDashboard',adminRoute)
app.post('/getAllSellers',adminRoute)
app.post('/suspendSeller',adminRoute)
app.post('/approveSeller',adminRoute)
app.post('/rejectSeller',adminRoute)
app.post('/addNewAdmin',adminRoute)
app.post('/getAllProducts',adminRoute)
app.post('/removeEntireProduct',adminRoute)


////////// DISTRIBUTOR ROUTE ///////
app.get('/distributerDashboard',distributerRoute)
app.get('/getOrderReadyForDelivery',distributerRoute)
app.post('/sendOrderForDelivery',distributerRoute)
app.post('/orderDelivered',distributerRoute)


////////// PRODUCT ROUTE /////////
app.post('/addToCart',productRoute)
app.post('/loadCart',productRoute)
app.get('/showUserCart',productRoute)
app.post('/removeProductFromUserCart',productRoute)
app.post('/changeInQuantity',productRoute)


////////. ORDER ROUTES /////////
app.get('/prepareOrderForUser',orderRoute)
app.get('/showPreparedOrder',orderRoute)
app.post('/placeOrder',orderRoute)
app.get('/cancelOrder',orderRoute)



///////// HOMEPAGE ROUTES /////////// 

app.get('*',homeRoute)
app.post('*',homeRoute)


/////// SERVER START /////////
app.listen(PORT,async ()=>{
    console.log(`SERVER STARTED AT PORT ${PORT}`)
    connectDB()
})
