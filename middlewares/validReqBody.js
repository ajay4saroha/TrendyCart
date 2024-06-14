import { namePattern,emailPattern,phonePattern,passwordPattern } from "../utils/pattrens.js";
let validate = (req,res,next)=>{
    const {firstname,lastname,registerEmailId,mobileNo,password,address}=req.body;
    if(!namePattern.test(firstname.trim())){
        res.status(400).send()
        return
    }
    if(!emailPattern.test(registerEmailId.trim())){
        res.status(400).send()
        return
    }
    if(!phonePattern.test(mobileNo.trim())){
        res.status(400).send()
        return
    }
    if(!passwordPattern.test(password)){
        res.status(400).send()
        return
    }
    console.log('Req body is valid')
    next()   
}
export{validate}