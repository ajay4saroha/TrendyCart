import {connect} from '../database.js'
let handleListedProducts = async(req,res)=>{
    try {
        if(!req.session.userInfo){
            res.status(400).redirect('/')
            return
        }
        const {emailId,role}=req.session.userInfo
        if(role!=='Seller'){
            res.status(404).redirect('/')
            return
        }
        let findProductsQuery = 'SELECT PD.NAME,PD.CATEGORY,PD.DESCRIPTION,PD.BRAND,PM.ID,PM.VOLUME,PM.PRICE,PM.DISCOUNT,PM.LISTED FROM PRODUCTMETRICS AS PM JOIN PRODUCTDETAILS AS PD ON PM.ID=PD.ID WHERE SELLEREMAILID=?'
        let listOfProducts = ((await connect.execute(findProductsQuery,[emailId]))[0])
        res.status(200).json(listOfProducts)
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}
let handleDeleteProduct = async(req,res)=>{
    try {
        let {emailId,role}= req.session.userInfo
        if(role!=='Seller'){
            res.status(400).redirect('/')
            return
        }
        let {productId} = req.body
        let findSellerQuery = 'SELECT * FROM PRODUCTDETAILS WHERE ID=? AND SELLEREMAILID=?'
        let seller = ((await connect.execute(findSellerQuery,[productId,emailId]))[0])[0]
        if(seller.length==0){
            res.status(404).send()
            return
        }
        let unlistQuery = 'UPDATE PRODUCTMETRICS SET LISTED=? WHERE ID=?'
        connect.execute(unlistQuery,[0,productId])
        .then(()=>{
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
let handleUpdateProductDetails = async(req,res)=>{
    try {
        let {productId}= req.body
        let findProductQuery = 'SELECT PD.NAME,PD.CATEGORY,PD.DESCRIPTION,PD.BRAND,PM.ID,PM.VOLUME,PM.PRICE,PM.DISCOUNT,PM.LISTED FROM PRODUCTMETRICS AS PM JOIN PRODUCTDETAILS AS PD ON PM.ID=PD.ID WHERE SELLEREMAILID=? AND PM.ID=?'
        let product = ((await connect.execute(findProductQuery,[req.session.userInfo.emailId,productId]))[0])
        if(product.length==0){
            res.status(404).send()
            return
        }
        product = product[0]
        res.status(200).json({product:product})   
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}
function validate(obj){
    let keys = Object.keys(obj)
    for(let key in keys){
        if(typeof obj[keys[key]] !== 'number' && obj[keys[key]]<0){
            return false
        }
        else{
            if (typeof obj[keys[key]] === 'string' && !obj[keys[key]].trim()) {
                return false;
            }
        }
    }
    return true
}
let handleInsertNewProductDetails = async(req,res)=>{
    try {
        if(!validate(req.body)){
            res.status(400).send()
            return
        }
        let {id,name,price,brand,volume,discount,description,listed}=req.body
        let updateDetails = 'UPDATE PRODUCTDETAILS AS PD SET NAME=?,BRAND=?,DESCRIPTION=? WHERE ID=?'
        let updateDetailsArg = [name,brand,description,id]
        let updateMetrics = 'UPDATE PRODUCTMETRICS AS PM SET PRICE=?,VOLUME=?,DISCOUNT=?,LISTED=? WHERE ID=?'
        let updateMetricsArg = [price,volume,discount,listed ? 1:0,id]
        let {NAME,BRAND,DESCRIPTION} = ((await connect.execute('SELECT NAME,BRAND,DESCRIPTION FROM PRODUCTDETAILS'))[0])[0]
        connect.execute(updateDetails,updateDetailsArg)
        .then(()=>{
            connect.execute(updateMetrics,updateMetricsArg)
            .then(()=>{
                res.status(200).send()
            })
            .catch(err=>{
                console.log(err)
                connect.execute('UPDATE PRODUCTDETAILS AS PD SET NAME=?,BRAND=?,DESCRIPTION=? WHERE ID=?',[NAME,BRAND,DESCRIPTION,id])
                .then(()=>{
                    res.status(500).send()
                })
                .catch(err=>{
                    console.log(err)
                    res.status(500).send()
                })
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
let handleAddNewProduct = async (req,res)=>{
    try{
      const {productName,category,description,price,brand,volume,sellerEmailId} = req.body
      const {image,images} = req.files
      if(productName.trim() =='' || category.trim()=='' || price<=0 || brand.trim()=='' || volume<=0 || sellerEmailId.trim()==''){
       res.status('400').send()
       return
      }
      let searchQuery = 'SELECT * FROM productDetails WHERE Name=? AND Category=? AND Brand=? AND SellerEmailId=?'
      let product = (await connect.execute(searchQuery,[productName,category,brand,sellerEmailId]))[0]
      if(product.length>0){
        res.status(402).send();
        return
      }
      let tImg = (image[0]).filename
      let oImg = []
      if(images){
       images.forEach(element => {
          oImg.push(element.filename)
         });
      }
        let productId = `${Date.now()}${sellerEmailId}`
        let detailsArg = [productId,productName,category,description,brand,tImg,sellerEmailId,oImg]
        let queryForDetails = 'INSERT INTO PRODUCTDETAILS VALUES(?,?,?,?,?,?,?,?)'
        connect.execute(queryForDetails,detailsArg)
        .then(()=>{
            let metricsArg= [productId,volume,price,0,1]
            let queryForMetrics = 'INSERT INTO PRODUCTMETRICS VALUES(?,?,?,?,?)'
            connect.execute(queryForMetrics,metricsArg)
            .then(
                res.status(200).send()
            )
            .catch(err=>{
                console.log(err)
                let delQuery = 'DELETE * FROM PRODUCTDETAILS WHERE ID="?"'
                connect.execute(delQuery,productId)
                .then(
                    res.status(500).send()
                )
                .catch(err=>{
                    console.log(err)
                })
            })
        })
        .catch(err=>{
            console.log(err)
            res.status(500).send()
        })
      }
      catch(err){
       console.log(err)
         res.status(500).send()
      }
} 
let handleSellerOrders = async(req,res)=>{
    try {
        const {emailId} = req.session.userInfo
        let query = 'SELECT O.ID,O.ORDEREDAT,O.DISPATCHEDAT,O.PRODUCT,O.VOLUME,O.BILL FROM ORDERS AS O WHERE SELLEREMAILID=? ORDER BY ORDEREDAT DESC'
        let data= (await connect.execute(query,[emailId]))[0]
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(500).send()   
    }
}
let handleDispatchOrder = async(req,res)=>{
    try {
        let {orderId,volume,productId} =req.body
        let {emailId} = req.session.userInfo
        let query = 'UPDATE ORDERS SET DISPATCHEDAT=? WHERE SELLEREMAILID=? AND ID=?'
        let queryArg = [Date.now(),emailId,orderId]
        connect.execute(query,queryArg)
        .then(async ()=>{
            let updateProductMetrics = 'UPDATE PRODUCTMETRICS AS PM SET VOLUME = PM.VOLUME-? WHERE ID=?'
            connect.execute(updateProductMetrics,[volume,productId])
            .then(()=>{
                res.status(200).send()
            })
            .catch(err=>{
                console.log(err)
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
export{
    handleListedProducts,
    handleDeleteProduct,
    handleUpdateProductDetails,
    handleInsertNewProductDetails,
    handleAddNewProduct,
    handleSellerOrders,
    handleDispatchOrder
}