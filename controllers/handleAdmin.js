import { connect } from "../database.js"
import bcrypt from 'bcrypt'
import { passwordPattern } from "../utils/pattrens.js"
import nodemailer from 'nodemailer'
import { getTransporter } from "./handleUser.js"
let handleAdminDashboard = async (req,res)=>{
    res.render('dynamics/adminDashboard',{data:req.session.userInfo})
}
let handleGetAllSellers = async(req,res)=>{
    try {
        let query = 'SELECT * FROM SELLERS'
        let sellersList = (await connect.execute(query))[0]
        res.status(200).json(sellersList)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}
let handleSuspendSeller = async(req,res)=>{
    try {
        let {emailId} = req.body
        let seller = ((await connect.execute('SELECT * FROM USERS WHERE EMAILID=? AND ROLE=?',[emailId,'Seller']))[0])
        if(seller.length==0){
            res.status(404).send()
            return
        }
        seller=seller[0]
        let updateSellersQuery = `UPDATE SELLERS SET STATUS="Suspended" WHERE EMAILID=?`
        connect.execute(updateSellersQuery,[emailId])
        .then(()=>{
            let updateUsersQuery = `UPDATE USERS SET ROLE="Buyer" WHERE EMAILID=?`
            connect.execute(updateUsersQuery,[emailId])
            .then(async()=>{
                let transporter = getTransporter()
                await transporter.sendMail({
                    from:`Account Suspended by Admin <ajay3saroha@gmail.com>`,
                    to:emailId,
                    subject:'Seller Account Suspended',
                    text:'Your role as seller is suspended. Please contact your admin for more Info'
                })
                res.status(200).send()
            })
            .catch(async err=>{
                console.log(err)
                await connect.execute('UPDATE USERS SET STATUS="Approved" WHERE EMAILID=?',[emailId])
                res.status(500).send()
            })
        })
        .catch(err=>{
            console.log(err)
            res.status(500).send()
        })
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }

}
let handleApproveUser = async(req,res)=>{
    try {
        let {emailId} = req.body
        let seller = ((await connect.execute('SELECT * FROM USERS WHERE EMAILID=?',[emailId]))[0])
        if(seller.length==0){
            res.status(404).send()
            return
        }
        seller=seller[0]
        let updateSellersQuery = `UPDATE SELLERS SET STATUS="Approved" WHERE EMAILID=?`
        connect.execute(updateSellersQuery,[emailId])
        .then(()=>{
            let updateUsersQuery = `UPDATE USERS SET ROLE="Seller" WHERE EMAILID=?`
            connect.execute(updateUsersQuery,[emailId])
            .then(async()=>{
                let transporter = getTransporter()
                await transporter.sendMail({
                    from:`Account Approved by Admin <ajay3saroha@gmail.com>`,
                    to:emailId,
                    subject:'Seller Account Approved',
                    text:'Your are now a seller on TrendyCart. Start your journey'
                })
                res.status(200).send()
            })
            .catch(async err=>{
                console.log(err)
                await connect.execute('UPDATE SELLERS SET STATUS="Suspended" WHERE EMAILID=?',[emailId])
                res.status(500).send()
            })
        })
        .catch(err=>{
            console.log(err)
            res.status(500).send()
        })
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}
let handleRejectSeller = async(req,res)=>{
    try {
        let {emailId} = req.body
        let seller = ((await connect.execute('SELECT * FROM USERS WHERE EMAILID=?',[emailId]))[0])
        if(seller.length==0){
            res.status(404).send()
            return
        }
        seller=seller[0]
        let updateUsersQuery = `UPDATE SELLERS SET STATUS="Rejected" WHERE EMAILID=?`
        connect.execute(updateUsersQuery,[emailId])
        .then( async()=>{
            let transporter = getTransporter()
                await transporter.sendMail({
                    from:`Request Rejected by Admin <ajay3saroha@gmail.com>`,
                    to:emailId,
                    subject:'Request to become seller on TrendyCart rejected',
                    text:'Your request to become seller is rejected. Please contact your admin for more Info'
                })
            res.status(200).send()
        })
        .catch(err=>{
            console.log(err)
            res.status(500).send()
        })
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}
let handleAddNewAdmin = async(req,res)=>{
    try {
        const {firstname,lastname,emailId,password} = req.body
        if(!firstname.trim() || !emailId.trim() || !passwordPattern.test(password)){
            res.status(402).redirect('/adminDashboard')
            return
        }
        
        let name = `${firstname} ${lastname}`
        let insertQuery = 'INSERT INTO USERS VALUES(?,?,?,"Admin",1)'
        let hp = await bcrypt.hash(password,10)
        let existingUser = (await connect.execute('SELECT * FROM USERS WHERE EMAILID=?',[emailId]))[0]
        if(existingUser.length>0){
            res.status(400).send()
            return
        }
        connect.execute(insertQuery,[emailId,name,hp])
        .then(()=>{
            res.status(200).send()
        })
        .catch(err=>{
            console.log(err)
            res.status(504).redirect('/adminDashboard')
        })
    } catch (error) {
        console.log(error)
        res.status(500).redirect('/adminDashboard')
    }
}
let handleGetAllProducts = async(req,res)=>{
    try {
        let query ='SELECT PD.id,PD.name,PD.category,PD.brand,PD.sellerEmailId,PM.listed FROM PRODUCTDETAILS AS PD JOIN PRODUCTMETRICS AS PM ON PD.ID=PM.ID'
        let products= (await connect.query(query))[0]
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
        res.status(500).redirect('/adminDashboard')
    }
}
let handleRemoveProduct = async(req,res)=>{
    try {
        const{productId} = req.body
        let detailsQuery = 'SELECT * FROM PRODUCTDETAILS AS PD WHERE ID=?'
        let productDetails = (await connect.execute(detailsQuery,[productId]))[0]
        if(productDetails.length==0){
            res.status(404).send()
            return
        }
        productDetails = productDetails[0]
        const {Name,Brand,Category,selleremailid} = productDetails
        connect.execute('DELETE FROM PRODUCTDETAILS AS PD WHERE ID=?',[productId])
        .then(()=>{
            connect.execute('DELETE FROM PRODUCTMETRICS AS PM WHERE ID=?',[productId])
            .then(async()=>{
                let transporter = getTransporter()
                await transporter.sendMail({
                    to:`${selleremailid}`,
                    from:'ajay3saroha@gmail.com',
                    subject:'Product Removed',
                    html:`<h5>Product Details</h5>
                            <ul>
                                <li>Name:${Name}</li>
                                <li>Brand:${Brand}</li>
                                <li>Category:${Category}</li>
                            </ul>
                            ANY QUERY PLEASE CONTACT ADMIN`
                })
                res.status(200).send()
            })
            .catch(async err=>{
                console.log(err)
                let args = []
                for(let key in Object.keys(productDetails)){
                    args.push(productDetails[key])
                }
                await connect.execute('INSERT INTO PRODUCTDETAILS VALUES (?,?,?,?,?,?,?,?)',args)
                res.status(500).send()
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}

export{handleAdminDashboard,
    handleGetAllSellers,
    handleSuspendSeller,
    handleApproveUser,
    handleRejectSeller,
    handleAddNewAdmin,
    handleGetAllProducts,
    handleRemoveProduct,
    
}