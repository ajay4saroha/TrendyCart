import express from 'express'
const homeRoute = express.Router()
import {
    handleHome, 
    handleLoadProducts,
    handleStartChat
} from'../controllers/homepage.js'

/////////// Router /////////////
homeRoute.get('/',handleHome)
homeRoute.post('/loadProducts',handleLoadProducts)
homeRoute.get('/startChat',handleStartChat)
homeRoute.get('*',(req,res)=>res.redirect('/'))
homeRoute.post('*',(req,res)=>res.redirect('/'))
export{homeRoute}
