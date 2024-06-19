import { users } from "./handleHelpSupport.js"
import { io } from "../server.js"
let handleMappingUser = (data)=>{
    let user = users.find(user=>user.emailId == data.emailId)
    if(user){
        user.socketId = socket.id
        return
    }
    users.push(data) 
}

let handleSendMsg = (data)=>{
    let anotherUser = users.filter(user=>user.emailId!==data.email)
    if(anotherUser.length==0){
        return;
    }
    io.to(anotherUser[0].socketId).emit('newMsg',data.message)
}
export{handleMappingUser,handleSendMsg}