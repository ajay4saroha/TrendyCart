const filterCart =(req,res,next)=>{
    if(req.originalUrl=='/addNewProduct' || req.originalUrl=='/loadCart'){
        next()
    }
    else{
        if(!req.productId){
            return res.redirect('/')
        }
        else{
            next()
        }
    }
}
module.exports={filterCart}