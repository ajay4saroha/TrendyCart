import { connect } from "../database.js"
let handleDashboard = async(req,res)=>{
    try{
        res.render('dynamics/distributerDashboard',{data:req.session.userInfo})
    }
    catch(err){
        console.log(err)
        res.status(500).redirect('/')
    }
}
let handleGetOrders = async(req,res)=>{
    try{
        let orders = (await connect.execute('SELECT id,orderedAt,dispatchedAt,outForDeliveryAt,deliveredAt,address FROM ORDERS AS O WHERE dispatchedAt!=0 ORDER BY DISPATCHEDAT DESC'))[0]
        if(orders.length==0){
            res.status(304).send()
            return
        }
        res.status(200).json(orders)
    }
    catch(err){
        console.log(err)
        res.status(500).send()
    }
}
let handleDeliveredOrder = async(req,res)=>{
    try {
        let {Id} = req.body
        let query = 'UPDATE ORDERS SET deliveredAt=? WHERE ID=?'
        connect.execute(query,[Date.now(),Id])
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
let handleSendForDelivery = async(req,res)=>{
    try {
        let {Id} = req.body
        let query = 'UPDATE ORDERS SET outForDeliveryAt=? WHERE ID=?'
        connect.execute(query,[Date.now(),Id])
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
export{handleDashboard,handleGetOrders,handleDeliveredOrder,handleSendForDelivery}