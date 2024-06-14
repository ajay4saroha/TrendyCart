import { connect } from "../database.js";
let adminCheck = async(req,res,next)=>{
    try {
        if(!req.session.userInfo){
            res.status(420).redirect('/')
            return;
        }
        let searchAdmin = 'SELECT * FROM USERS WHERE EMAILID=? AND ROLE=?'
        let admin = ((await connect.execute(searchAdmin,[req.session.userInfo.emailId,'Admin']))[0])
        if(admin.length==0){
            res.status(404).send()
            return
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}
export{adminCheck}