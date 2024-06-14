import express from 'express'
const sellerRoute = express.Router()
import { handleAddNewProduct,handleListedProducts,handleUpdateProductDetails,handleInsertNewProductDetails,handleDeleteProduct,handleSellerOrders,handleDispatchOrder} from '../controllers/handleSeller.js'
import { sellerLoginMiddleware } from '../middlewares/sellerMiddleware.js'
import { imageHandler } from '../middlewares/imageHandler.js'
/////// MIDDLEWARES ///////
sellerRoute.use(sellerLoginMiddleware)

///// ROUTES ///////
sellerRoute.post('/addNewProduct',imageHandler.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 5 }]),handleAddNewProduct)
sellerRoute.get('/listedProducts',handleListedProducts)
sellerRoute.post('/deleteProduct',handleDeleteProduct)
sellerRoute.post('/updateProductDetails',handleUpdateProductDetails)
sellerRoute.post('/insertNewProductDetails',handleInsertNewProductDetails)
sellerRoute.get('/getSellerOrders',handleSellerOrders)
sellerRoute.post('/dispatchOrder',handleDispatchOrder)
// sellerRoute.get('*',(req,res)=>{
//     res.redirect('/')
// })
// sellerRoute.post('*',(req,res)=>{
//     res.redirect('/')
// })
export{sellerRoute}