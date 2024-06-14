import express from 'express'
import { checkDistributer } from '../middlewares/distributerMiddleware.js'
const distributerRoute =  express.Router()
import { handleDashboard,handleGetOrders,handleDeliveredOrder,handleSendForDelivery } from '../controllers/handleDistributer.js'

/////// MIDDLESWARES /////
distributerRoute.use(checkDistributer)


////// ROUTES ////////
distributerRoute.get('/distributerDashboard',handleDashboard)
distributerRoute.get('/getOrderReadyForDelivery',handleGetOrders)
distributerRoute.post('/orderDelivered',handleDeliveredOrder)
distributerRoute.post('/sendOrderForDelivery',handleSendForDelivery)
export{distributerRoute}