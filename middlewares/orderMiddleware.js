let checkUser = async(req,res,next)=>{
    if(!req.session.userInfo){
        res.status(400).redirect('/')
        return;
    }
    next()
}
let checkOrder = async(req,res,next)=>{
    if(!req.session.order){
        res.status(404).send(`CAN'T ACCESS DIRECTY.<a href="/">HOME</a>`)
        return
    }
    next()
}
export{checkUser,checkOrder}