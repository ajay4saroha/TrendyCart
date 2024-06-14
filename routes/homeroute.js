import express from 'express'
const homeRoute = express.Router()
import {
    handleHome, 
    handleLoadProducts,
} from'../controllers/homepage.js'

/////////// Router /////////////
homeRoute.get('/',handleHome)
homeRoute.post('/loadProducts',handleLoadProducts)
homeRoute.get('/getAllProducts',(req,res)=>{
    res.render('static/')
})
homeRoute.get('*',(req,res)=>res.redirect('/'))
homeRoute.post('*',(req,res)=>res.redirect('/'))
export{homeRoute}
