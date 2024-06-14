import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import mysql from 'mysql2/promise'
import { connect } from '../database.js';
import { passwordPattern } from '../utils/pattrens.js';
const secretKey = "ecommere@45612";
const emailSender = 'ajay3saroha@gmail.com'

///////     QUERIES   ////////
let searchQuery = 'SELECT * FROM USERS WHERE EmailId=?'
let updatePasswordQuery = 'UPDATE USERS SET Password=? WHERE EmailId=?'

let getTransporter=()=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: emailSender,
          pass: "ypvxfgdqoplptzdc",
        },
      });
    return transporter
}
let handleAddUser = async (req, res) => {
  const {
    firstname,
    lastname,
    registerEmailId,
    mobileNo,
    password,
    address,
  } = req.body;
  let query = 'SELECT EmailId FROM USERS WHERE EmailId=?'
  let queryResult = await connect.execute(query,[registerEmailId])
  let existingUser = queryResult[0]
  if(existingUser.length>0){
    res.status(409).send()
    return;
  }
  let hashedPassword = await bcrypt.hash(password, 10);
  try {
    let buyersDbArg = [registerEmailId,`${firstname} ${lastname}`,,mobileNo,address]
    let userDbArg =[registerEmailId,`${firstname} ${lastname}`,hashedPassword,'Buyer',0]
    let insertIntoBuyersQuery = 'INSERT INTO BUYERS VALUES (?,?,?, CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP(),?)'
    let insertIntoUsersQuery = 'INSERT INTO USERS VALUES (?,?,?,?,?)'
    let added = false
    connect.execute(insertIntoBuyersQuery,buyersDbArg)
    .then(
      connect.execute(insertIntoUsersQuery,userDbArg)
      .then(async ()=>{
        console.log('User Added successfully')
        const transporter = getTransporter()
        const userData ={
          name:firstname,
          emailId:registerEmailId,
          role:'Buyer'
        }
        const accountVerifyToken = jwt.sign(userData,secretKey)
        const info = await transporter.sendMail({
          from:`Verify Email <${emailSender}>`,
          to:registerEmailId,
          subject:'Verify your account',
          text:`Hi,${firstname} Verify your account`,
          html:`<h5>Click the link below to verify your account</h5><br><a href="http://localhost:4000/verifyAccount?token=${accountVerifyToken}">Verify your account</a>`
        })
        res.status(200).send(`Registeration Success <a href="/">Home</a>`);
      })
      .catch(err=>{
        console.log(err)
        connect.execute('DELETE FROM BUYERS WHERE EmailId=?',[buyersDbArg[0]])
        res.status(500).send()
      })
    )
    .catch(err=>{
      console.log("User Not Added\n",err)
      res.status(500).send()
    })
  } catch (err) {
    console.log(err);
    res.status(500).send()
    return;
  }
};
let handleLoginUser = async (req, res) => {
  const { LoginEmailId, LoginPassword } = req.body;
  try {
    let user = ((await connect.execute(searchQuery,[LoginEmailId]))[0])[0]
    if (!user) {
      res.status(404).send("User not exist");
      return;
    }
    let match = await bcrypt.compare(LoginPassword, user.Password);
    if (!match) {
      res.status(400).send("Wrong Password");
      return;
    }
    req.session.isLoggedIn = true;
    req.session.userInfo = {
      name: user.Name,
      emailId: user.EmailId,
      role: user.Role,
    };
    res.status(200).json({ name: user.Name, role: user.Role });
  } catch (error) {
    console.log(error);
    res.status(500).send()
  }
};
let handleLogoutUser = async (req, res) => {
  req.session.userInfo = null;
  req.session.isLoggedIn = false;
  req.session.destroy((err) => {
    if(err){
      console.log(err)
    }
  });
  res.redirect("/");
};
let handleSellerDashboard = async (req, res) => {
  if (!req.session.userInfo) {
    res.redirect("/");
    return;
  }
  const { name, emailId, role } = req.session.userInfo;
  if(role==='Admin'){
    return res.redirect('/adminDashboard')
  }
  if(role==='Distributer'){
    return res.redirect('/distributerDashboard')
  }
  if (role !== "Seller") {
    res.status(404).send("Your are not an authorised seller");
    return;
  }
  res.render("dynamics/sellerDashboard", { data: req.session.userInfo });
};
let handleForgotPassword = async (req, res) => {
  res.render("static/forgotPassword");
};
let handleSendEmail_forgotPassword = async (req, res) => {
  try {
    const { emailId } = req.body;
    let user = ((await connect.execute(searchQuery,[emailId]))[0])[0]
    console.log(user)
    if (!user) {
      res.status(404).send();
      return;
    }
    let data = {
      emailId: user.EmailId,
      name: user.Name,
    };
    const token = jwt.sign(data, secretKey);
    const transporter = getTransporter()
    const info = await transporter.sendMail({
      from: `Reset Password <${emailSender}>`,
      to: emailId,
      subject: "Reset your password",
      text: `Hi,${data.name} Change your password`,
      html: `<h4>Click on below link to reset password</h4><br>http://localhost:4000/changePassword?token=${token}`,
    });
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};
let handleChangePassword = async (req, res) => {
  try {
    const { token } = req.query;
    const verify = jwt.verify(token, secretKey);
    if (verify==null) {
      res.status(501).render("static/changePassword", {token:'',status: 501,msg: "Bad Request not a valid token",});
      return;
    }
    const { name, emailId, iat } = verify;
    let user = await connect.execute(searchQuery,[emailId])
    if (!user) {
      res.status(404).render("static/changePassword", {token:'',status: 404,msg: "Email not exist token may be changed",});
      return;
    }
    res.status(200).render("static/changePassword", {token:token,status: 200,msg: "user found",});
  } catch (error) {
    console.log(error)
    res.status(500).render("static/changePassword", {token:'',status: 500, msg: `Don't access directly`,});
  }
};
let handleUpdatePassword = async (req,res)=>{
    try {
        const{token,pass1}=req.body
        let data = jwt.verify(token,secretKey)
        let {name,emailId} = data
        let user = await connect.execute(searchQuery,[emailId])
        if(!user){
            res.status(404).send()
            return
        }
        let newPass = await bcrypt.hash(pass1,10)
        connect.execute(updatePasswordQuery,[newPass,emailId])
        .then(
          res.status(200).send()
        )
        .catch(err=>{
          console.log(err)
          res.status(405).send()
        })
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
}
let handleVerifyAccount = async(req,res)=>{
    try {
        const {token} = req.query
        if(!token){
            res.status(501).render('static/verifyAccount',{status:501,msg:'Bad Request register first'})
            return
        }
        let data = jwt.verify(token,secretKey)
        // let fake = await users.updateMany({},{$set:{verifiedAccount:false}})
        // console.log(fake)
        // users.aggregate([{
        //     $addFields:{'verfiedAccount':false}}
        // ])
        // let user = await users.findOneAndUpdate({emailId:data.emailId},{$addFields:{'verifiedAccount':true}},{returnDocument:'after'})
        let user = await connect.execute(searchQuery,[data.emailId])
        if(!user){
            res.status(404).render('static/verifyAccount',{status:404,msg:"User not exist register first"})
            return
        }
        // users.update({_id:user._id},{$set:{'verifiedAccount':true}}).exec()
        // await users.updateMany({
        //     $set:{'verifiedAccount':false}
        // })
        connect.execute('UPDATE USERS SET Verified=? WHERE EmailId=?',[1,data.emailId])
        .then(
          res.status(200).render('static/verifyAccount',{status:200,msg:"Account verified successfully"})
        )
        .catch(err=>{
          res.status(409).render('static/verifyAccount',{status:500,msg:"Failed DB Error"})
        })
    } catch (error) {
        console.log(error)
        res.status(500).render('static/verifyAccount',{status:500,msg:"Server not responding please try again"})
    }

}
let handleBecomeSeller = async(req,res)=>{
  try {
    if(!req.session.userInfo){
      res.status(400).redirect('/')
      return
    }
    let {emailId} = req.session.userInfo
    let searchSellerDetails = 'SELECT * FROM SELLERS WHERE EMAILID=?'
    let temp = (await connect.execute(searchSellerDetails,[emailId]))[0]
    if(temp.length>0){
      res.send('CONTACT TO ADMIN TO RESTORE YOUR ACCESS. CHECK YOUR EMAIL FOR MORE INFORMATION <a href="/">HOME</a>')
      return
    }
    res.render('static/sellerForm');
  } catch (error) {
    console.log(error)
    res.status(500).redirect('/')
  }
}
let handleNewSeller = async(req,res)=>{
  try {
    if(!req.session.userInfo || !req.body){
      res.status(400).redirect('/')
      return
    }
    const {emailId} = req.session.userInfo
    const {vatNum,gstNum,address} = req.body
    let findSellerQuery = 'SELECT EMAILID FROM SELLERS WHERE EMAILID=?'
    let seller = (await connect.execute(findSellerQuery,[emailId]))[0]
    if(seller.length>0){
      res.status(409).redirect('/')
      return
    }
    let insertQuery = 'INSERT INTO SELLERS VALUES (?,?,?,?,CURRENT_TIMESTAMP(),"Pending")';
    connect.execute(insertQuery,[emailId,vatNum,gstNum,address])
    .then(()=>{
      res.status(200).send()
    })
    .catch(err=>{
      console.log(err)
      res.status(500).redirect('/reqToBecomeSeller')
    })
  } catch (error) {
   console.log(error)
   res.status(500).redirect('/')
  }
}
let handleGetUserOrders = async(req,res)=>{
  try {
    if(!req.session.userInfo){
      res.status(400).redirect('/')
      return
    }
    const {emailId} = req.session.userInfo
    let orders = (await connect.execute('SELECT * FROM ORDERS WHERE ORDEREDBY=?',[emailId]))[0]
    let orderList = []
    if(orders.length==0){
      res.redirect('/')
      return
    }else{
      orders.forEach(async element => {
        let temp = {}
        temp.id = element.id
        temp.ordered = element.orderedAt ? true:false
        temp.dispatched = element.dispatchedAt ? true:false
        temp.outForDelivery = element.outForDeliveryAt ? true:false 
        temp.delivered = element.deliveredAt ? true:false
        temp.product = element.product
        temp.price = element.bill
        temp.quantity = element.volume
        orderList.push(temp)
      });
    }
    for(let i=0;i<orderList.length;i++){
      let item = (await connect.execute('SELECT PD.ID,PD.THUMBNAIL,PD.NAME,PD.CATEGORY,PD.BRAND FROM PRODUCTDETAILS AS PD JOIN PRODUCTMETRICS AS PM ON PD.ID=PM.ID WHERE PM.ID=?',[orderList[i].product]))[0]
      if(item.length==0){
        orderList.filter(product=>product.product!==orderList[i].product)
      }
      else{
        orderList[i].product = item[0]
      }
    }
    let {name,role} = req.session.userInfo
    res.status(200).render('dynamics/userOrders',{data:{name:name,role:role,orders:orderList}})
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal Server Error <a href="/">HOME</a>')
  }
}
export{
  handleAddUser,
  handleLoginUser,
  handleLogoutUser,
  handleSellerDashboard,
  handleForgotPassword,
  handleSendEmail_forgotPassword,
  handleChangePassword,
  handleUpdatePassword,
  handleVerifyAccount,
  handleBecomeSeller,
  handleNewSeller,
  getTransporter,
  handleGetUserOrders
};

