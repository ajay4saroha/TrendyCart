let buyerValidation = (req,res,next)=>{
    if(!req.session.userInfo){
        res.status(400).redirect('/')
        return
    }
    next()
}
export{buyerValidation}