import { connect } from "../database.js"
let handlePrepareOrder = async(req,res)=>{
    try {
        const {emailId} = req.session.userInfo
        let userCart = (await connect.execute('SELECT * FROM USERCART WHERE EMAILID=?',[emailId]))[0]
        if(userCart.length==0){
            res.status(404).send()
            return
        }
        userCart = userCart[0]
        let preparedOrder = []
        let productsList = userCart.products
        for(let i=0;i<productsList.length;i++){
            let query ='SELECT PD.ID,PD.NAME,PD.CATEGORY,PD.BRAND,PD.THUMBNAIL,PD.SELLEREMAILID,PM.PRICE,PM.VOLUME,PM.LISTED FROM PRODUCTDETAILS AS PD JOIN PRODUCTMETRICS AS PM ON PD.ID=PM.ID WHERE PD.ID=?'
            let product = (await connect.execute(query,[(productsList[i]).productId]))[0]
            if(product.length==0){
                preparedOrder.push({product:{productId:(productsList[i]).productId},available:false,quantity:productsList[i].quantity})
            }
            else{
                let temp = {}
                product = product[0]
                if(product.LISTED==0 || product.VOLUME==0){
                    temp.product={}
                    temp.available=false
                }
                else{
                    let chkSeller = (await connect.execute('SELECT * FROM SELLERS WHERE EMAILID=? AND STATUS="Approved"',[product.SELLEREMAILID]))[0]
                    if(chkSeller.length==0){
                        temp.product={productId:(productsList[i]).productId}
                        temp.available=false
                    }
                    else{
                        temp.product={
                            productId:product.ID,
                            name:product.NAME,
                            category:product.CATEGORY,
                            brand:product.BRAND,
                            img:product.THUMBNAIL,
                            price:product.PRICE,
                            sellerEmailId:product.SELLEREMAILID,
                            quantity:((productsList[i]).quantity>product.VOLUME) ? product.VOLUME:(productsList[i]).quantity
                        }
                        temp.available = true
                    }
                }
                preparedOrder.push(temp)
            }
        }
        // res.status(200).json(preparedOrder)
        req.session.order = preparedOrder
        res.redirect("/showPreparedOrder")
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}
let handleShowPreparedOrder = async(req,res)=>{
    try { 
        if(!req.session.order){
            res.status(420).redirect('/')
            return;
        }
        let order = req.session.order
        let totalAmount = 0
        order.forEach(item => {
            if(item.available==true){
                totalAmount += item.product.price * item.product.quantity
            }
        });
        req.session.totalBill = totalAmount
        res.render('dynamics/preparedOrder',{data:req.session})
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}
let handleCancelOrder = async(req,res)=>{
    try {
        req.session.order=null
        res.status(200).redirect('/showUserCart')
    } catch (error) {
        console.log(error)
        res.status(500).send('INTERNAL SERVER ERROR<a href="/">HOME</a>')
    }
}
let handlePlaceOrder = async(req,res)=>{
    try {
        let {emailId} = req.session.userInfo
        let order = req.session.order
        order = order.filter(product=> product.available==true)
        let orderId = `${Date.now()}-${req.session.userInfo.emailId}`
        let productList =[]
        order.forEach(element => {
            productList.push({productId:element.product.productId,sellerEmailId:element.product.sellerEmailId,quantity:element.product.quantity})
        });
        let {address} = req.body
        if(!address.trim()){
            let user = (await connect.execute('SELECT ADDRESS FROM BUYERS WHERE EMAILID=?',[emailId]))[0]
            if(user.length==0){
                res.status(404).send()
                return
            }
            user = user[0]
            address = user.ADDRESS
        }
        let index = (await connect.execute('SELECT max(id) from orders'))[0]
        if(index.length==0){
            index=1
        }
        else{
            index = index[0]
            index = index['max(id)']+1
        }
        for(let i=0;i<productList.length;i++){
            let query = `INSERT INTO ORDERS VALUES(?,?,?,0,0,0,?,?,?,?)`
            let queryArg =[index,emailId,Date.now(),productList[i].productId,address,productList[i].sellerEmailId,productList[i].quantity]
            await connect.execute(query,queryArg)
            index++;
        }
        connect.execute('DELETE FROM USERCART WHERE EMAILID=?',[emailId])
        .then(()=>{
            res.status(200).send()
        })
        .catch(err=>{
            console.log(err)
            res.status(500).send()
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('INTERNAL SERVER ERROR.<a href="/">HOME</a>')
    }
}
export{
    handlePrepareOrder,
    handleShowPreparedOrder,
    handleCancelOrder,
    handlePlaceOrder
}