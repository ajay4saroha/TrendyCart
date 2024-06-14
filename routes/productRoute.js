import express from 'express'
const productRoute = express.Router()
import {handleAddToCart,
        handleLoadCart,
        handleShowUserCart,
        handleRemoveProductFromUserCart,
        handleChangeInQuantity} from '../controllers/handleProduct.js'


/////// MIDDLEWARES ///////


///////// ROUTES /////////

productRoute.post('/addToCart',handleAddToCart)
productRoute.post('/loadCart',handleLoadCart)
productRoute.get('/showUserCart',handleShowUserCart)
productRoute.post('/removeProductFromUserCart',handleRemoveProductFromUserCart)
productRoute.post('/changeInQuantity',handleChangeInQuantity)


////////handle other reqs/////////////
productRoute.get('*',(req,res)=>res.redirect('/dashboard'))

export{productRoute}