import { connect } from "../database.js"
let sellerLoginMiddleware = (req,res,next)=>{
    if(!req.session.userInfo){
        res.status(400).redirect('/')
        return
    }
    
    if(req.session.userInfo.role!='Seller'){
        res.status(404).redirect('/')
        return
    }
    connect.execute('SELECT ROLE FROM USERS WHERE EMAILID=?',[req.session.userInfo.emailId])
    .then(data=>{
        data = data[0]
        if(data.length==0){
            res.status(400).redirect('/')
        }
        data=data[0]
        if(data.ROLE!=='Seller'){
            req.session.userInfo.role = data.ROLE
            res.status(409).redirect('/')
            return
        }
        next()
    })
    .catch(err=>{
        console.log(err)
        res.status(500).redirect('/')
    })
}
export{
    sellerLoginMiddleware,
}