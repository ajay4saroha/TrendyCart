import express from 'express'
const sellerRoute = express.Router()
import { handleAddNewProduct,handleListedProducts,handleUpdateProductDetails,handleInsertNewProductDetails,handleDeleteProduct,handleSellerOrders,handleDispatchOrder,handleGetReport} from '../controllers/handleSeller.js'
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
sellerRoute.get('/getReportForSeller',handleGetReport)
// sellerRoute.get('*',(req,res)=>{
//     res.redirect('/')
// })
// sellerRoute.post('*',(req,res)=>{
//     res.redirect('/')
// })
export{sellerRoute}