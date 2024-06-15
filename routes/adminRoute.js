import express  from 'express'
const adminRoute = express.Router()
import { adminCheck } from '../middlewares/adminMiddleware.js'
import { handleAdminDashboard,
    handleGetAllSellers,
    handleSuspendSeller,
    handleApproveUser,
    handleRejectSeller,
    handleAddNewAdmin,
    handleGetAllProducts,
    handleRemoveProduct,
    handleBuyersReport,
    handleSellersReport
} from '../controllers/handleAdmin.js'
/////// MIDDLEWARES ///
adminRoute.use(adminCheck)

////// ROUTES ///////
adminRoute.get('/adminDashboard',handleAdminDashboard)
adminRoute.post('/getAllSellers',handleGetAllSellers)
adminRoute.post('/suspendSeller',handleSuspendSeller)
adminRoute.post('/approveSeller',handleApproveUser)
adminRoute.post('/rejectSeller',handleRejectSeller)
adminRoute.post('/addNewAdmin',handleAddNewAdmin)
adminRoute.post('/getAllProducts',handleGetAllProducts)
adminRoute.post('/removeEntireProduct',handleRemoveProduct)
adminRoute.get('/getBuyersReportForAdmin',handleBuyersReport)
adminRoute.get('/getSellersReportForAdmin',handleSellersReport)


export{adminRoute}