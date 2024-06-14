import express from 'express'
import { checkUser,checkOrder } from '../middlewares/orderMiddleware.js'
const orderRoute = express.Router()
import {handlePrepareOrder,
    handleShowPreparedOrder,
    handleCancelOrder,
    handlePlaceOrder
} from '../controllers/handleOrder.js'
/////// MIDDLEWARES /////
orderRoute.use(checkUser)
orderRoute.use('/placeOrder'||'/cancelOrder',checkOrder)

/////// ROUTES /////////
orderRoute.get('/prepareOrderForUser',handlePrepareOrder)
orderRoute.get('/showPreparedOrder',handleShowPreparedOrder)
orderRoute.post('/placeOrder',handlePlaceOrder)
orderRoute.get('/cancelOrder',handleCancelOrder)

export{orderRoute}