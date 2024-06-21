import { connect } from "../database.js"
import { io } from "../server.js"
import { users } from "./handleSocket.js"
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
let handleStartChat = async(req,res)=>{
    try {
        if(!req.session.userInfo){
            res.status(400).send()
            return
        }
        res.status(200).json({emailId:req.session.userInfo.emailId}) 
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
    
}
let handleGetUsers = async(req,res)=>{
    try {
        if(!req.session.userInfo){
            res.status(400).send()
            return
        }
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}
 let handleChangeChatUser = async(req,res)=>{
    try {
        const {socketId} = req.body
        if(!req.session.userInfo){
            return res.status(400).send()
        }
        for(let i=0;i<users.length;i++){
            if(users[i].socketId === socketId || users[i].role==='Agent'){
                users[i].engaged = true
            }
            else{
                users[i].engaged = false
            }
        }
        res.status(200).send()
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
 }
export{handleHome,handleLoadProducts,handleStartChat,handleGetUsers,handleChangeChatUser}