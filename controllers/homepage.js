import { connect } from "../database.js"
let handleHome = async(req,res)=>{
    if(req.session.userInfo){
        let seller = (await connect.execute('SELECT * FROM SELLERS WHERE EMAILID=?',[req.session.userInfo.emailId]))[0]
        if(seller.length>0){
            req.session.userInfo.alreadySellerReq = true
        }
    }
    res.render('dynamics/homepage',{data:req.session.userInfo})
}
let handleLoadProducts = async(req,res)=>{
    let query = `SELECT PD.ID,PD.NAME,PD.CATEGORY,PD.DESCRIPTION,PD.BRAND,PD.THUMBNAIL,PM.PRICE,PM.DISCOUNT,PM.LISTED FROM PRODUCTDETAILS AS PD JOIN PRODUCTMETRICS AS PM ON PD.ID=PM.ID WHERE PM.LISTED=1 LIMIT 5 OFFSET ${req.body.skipProducts} `
    let productsList = (await connect.query(query))[0]
    res.json(productsList)
}
export{handleHome,handleLoadProducts}