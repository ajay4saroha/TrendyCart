let checkDistributer =async(req,res,next)=>{
    if(!req.session.userInfo){
        return res.status(400).redirect('/')
    }
    if(req.session.userInfo.role!=='Distributer'){
        return res.status(400).redirect('/')
    }
    next()
}
export{checkDistributer}