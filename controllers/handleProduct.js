import { connect } from "../database.js"

let handleAddToCart = async(req,res)=>{
   if(!req.session.userInfo){
      res.status(402).send()
      return
   }
   try {
      const {emailId}=req.session.userInfo
      const {id,quantity}=req.body
      let findUser = 'SELECT * FROM USERCART WHERE EMAILID=?'
      let existingUserCart = ((await connect.execute(findUser,[emailId]))[0])[0]
      let findProduct = 'SELECT * FROM PRODUCTMETRICS WHERE ID=?'
      let productChk = (await connect.execute(findProduct,[id]))[0]
      if(productChk.length==0){
         res.status(405).send()
         return
      }
      productChk = productChk[0]
      if(productChk.listed==false){
         res.status(304).send()
         return
      }
      if(productChk.volume==0){
         res.status(405).send()
         return
      }
      if(!existingUserCart){
         let query = 'INSERT INTO USERCART VALUES (?,?)'
         let queryArg = [emailId,[{productId:id,quantity:quantity}]]
         connect.execute(query,queryArg)
         .then(
            res.status(200).send()
         )
         .catch(err=>{
            console.log(err)
            res.status(500).send()
         })
         return
      }
      let productExists = false
      let productsList = existingUserCart.products
      for(let i=0;i<productsList.length;i++){
         if((productsList[i]).productId==id){
            (productsList[i]).quantity+=quantity
            productExists=true;
            break
         }
      }
      if(!productExists){
         productsList.push({productId:id,quantity:quantity})
      }
      let updateQuery = 'UPDATE USERCART SET PRODUCTS=? WHERE EMAILID=?'
      let updateQueryArg = [productsList,emailId]
      connect.execute(updateQuery,updateQueryArg)
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
// let handleQuantityOfProductForUser = async(req,res)=>{
//    if(!req.session.userInfo){
//       res.status(400).send()
//       return
//    }
//    try {
//       const emailId = req.session.userInfo.emailId
//       if(!emailId){
//          res.status(302).send()
//          return
//       }
//       let quantity = 0
//       const {productId}=req.body
//       let user = await userCart.findOne({emailId:emailId}).exec()
//       if(!user){
//          res.status(404).send()
//          return
//       }
//       (user.products).forEach(element => {
//          if(element.productId==productId && element.quantity){
//             quantity = element.quantity
//             return
//          }
//       });
//       console.log(quantity)
//    } catch (error) {
//       console.log(error)
//    }
// }
let handleLoadCart = async(req,res)=>{
   if(!req.session.userInfo){
      res.status(400).send()
      return
   }
   try {
      const {emailId} = req.session.userInfo
      let searchQuery = 'SELECT * FROM USERCART WHERE EMAILID=?'
      let user = ((await connect.execute(searchQuery,[emailId]))[0])[0]
      if(!user){
         res.status(404).send()
         return
      }
      res.json(user.products)
   } catch (error) {
      console.log(error)
   }
}
let handleShowUserCart=async(req,res)=>{
try {
   if(!req.session.userInfo){
      res.status(404).redirect('/')
      return
   }
   const emailId = req.session.userInfo.emailId
   let searchQuery = 'SELECT * FROM USERCART WHERE EMAILID=?'
   let user = ((await connect.execute(searchQuery,[emailId]))[0])[0]
   if(!user){
      res.status(404).redirect('/')
      return
   }
   let resObj = {}
   resObj.emailId = emailId
   let productsList = user.products
   let resProductList = []
   let searchProductQuery = 'SELECT PD.ID,PD.THUMBNAIL,PD.NAME,PD.CATEGORY,PM.PRICE,PD.BRAND,PD.DESCRIPTION FROM PRODUCTDETAILS AS PD JOIN PRODUCTMETRICS AS PM ON PD.ID=PM.ID WHERE PM.ID=?'
   for(let i=0;i<productsList.length;i++){
      let product = ((await connect.execute(searchProductQuery,[(productsList[i]).productId]))[0])[0]
      if(product){
         resProductList.push({product:new Object(product),quantity:(productsList[i]).quantity})
      }
   }
   resObj.products = resProductList
   res.render('dynamics/userCart',{data:resObj.products,name:req.session.userInfo.name})
} catch (error) {
      console.log(error.errmsg)
}
}
let handleRemoveProductFromUserCart = async (req,res)=>{
   try {
      if(!req.session.userInfo){
         res.status(400).redirect('/showUserCart')
         return
      }
      const {productId,quantityOfProduct} = req.body
      if(!productId){
         res.status(402).redirect('/showUserCart')
         return
      }
      const {emailId} = req.session.userInfo
      let searchQuery = 'SELECT * FROM USERCART WHERE EMAILID=?'
      let user = ((await connect.execute(searchQuery,[emailId]))[0])[0]
      if(user.length==0){
         res.status(404).redirect('/showUserCart')
         return
      }
      let userCartProducts = user.products
      let newCart = []
      for(let i=0;i<userCartProducts.length;i++){
         if((userCartProducts[i]).productId!=productId){
            newCart.push(userCartProducts[i])
         }
      }
      let updateQuery = 'UPDATE USERCART SET PRODUCTS=? WHERE EMAILID=?'
      connect.execute(updateQuery,[newCart,emailId])
      .then(
         res.status(200).send()
      )
      .catch(err=>{
         console.log(err)
         res.status(500).send()
      })
   } catch (error) {
      console.log(error)
      res.status(500).send()
   }
}
let handleChangeInQuantity = async(req,res)=>{
   try {
      if(!req.body || !req.session.userInfo){
         res.status(400).send()
         return
      }
      const {productId,updateCmd} = req.body
      const {emailId} = req.session.userInfo
      let searhProductQuery = 'SELECT * FROM PROdUCTMETRICS AS PM WHERE ID=?'
      let product = ((await connect.execute(searhProductQuery,[productId]))[0])[0]
      if(product.length==0){
         res.status(302).redirect('/showUserCart')
         return
      }
      if(product.listed==false){
         res.status(304).send()
         return
      }
      let findUserCart = 'SELECT * FROM USERCART WHERE EmailId=?'
      let user = ((await connect.execute(findUserCart,[emailId]))[0])[0]
      if(user.length==0){
         res.status(404).send()
         return
      }
      let temp = user.products
      let newCart = []
      for(let i=0;i<temp.length;i++){
         newCart.push(temp[i])
      }
      if(updateCmd=='increment'){
         for(let i=0;i<newCart.length;i++){
            if((newCart[i]).productId==productId){
               if(product.volume==0){
                  res.status(305).send()
                  return
               }
               (newCart[i]).quantity+=1
               break
            }
         }
      }
      else if(updateCmd=='decrement'){
         for(let i=0;i<newCart.length;i++){
            if((newCart[i]).productId==productId){
               if((newCart[i]).quantity==1){
                  continue
               }
               else{
                  (newCart[i]).quantity-=1
                  break
               }
            }
         }
      }
      else{
         res.status(400).redirect('/showUserCart')
         return
      }
      let updateCartQuery ='UPDATE USERCART SET PRODUCTS=? WHERE EMAILID=?'
      connect.execute(updateCartQuery,[newCart,emailId])
      .then(()=>{
         res.status(200).send()
      })
      .catch(err=>{
         console.log(err)
         res.status(500).send()
      })
   } catch (error) {
      console.log(error)
      res.status(500).redirect('/showUserCart')
   }
}


export{
    handleAddToCart,
   //  handleQuantityOfProductForUser,
    handleLoadCart,
    handleShowUserCart,
    handleRemoveProductFromUserCart,
    handleChangeInQuantity
}