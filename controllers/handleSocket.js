// import { users } from "./handleHelpSupport.js"
import { io } from "../server.js"
let users = []
let handleMappingUser = (data)=>{
    let user = users.find(user=>user.emailId==data.emailId)
    let agent = users.find(user=>user.emailId==data.emailId)
        if(agent){
            for(let i=0;i<users.length;i++){
                if(users[i].emailId == data.emailId){
                    users[i].socketId = data.socketId
                    return
                }
            }
        }
    if(data.emailId==='ajay3saroha@gmail.com'){
        data.engaged = true
        data.role = 'Agent'
    }
    else{

        let engagedUser = users.find(user=>user.engaged===true && user.role!=='Agent')
        if(engagedUser){
            data.engaged = false
        }
        else{
            data.engaged = true
        }
        data.role = 'seeker'
    }
    users.push(data) 
}

let handleSendMsg = (data)=>{
    let agent = users.find(user=>user.role==='Agent')
    let engagedUser = users.find(user=>user.role!=='Agent' && user.engaged)
    if(!engagedUser){
        for(let i=0;i<users.length;i++){
            if(users[i].emailId===data.email){
                users[i].engaged = true;
            }
        }
        engagedUser = users.find(user=>user.emailId==data.email)
    }
    if(!agent){
        io.to(engagedUser.socketId).emit('unavailable')
        return
    }
    if(data.email==='ajay3saroha@gmail.com'){
        io.to(engagedUser.socketId).emit('newMsg',{user:'Agent',msg:data.message})
        return
    }
    let user = users.find(user=>user.emailId==data.email)
    if(user.engaged){
        io.to(agent.socketId).emit('newMsg',{user:data.email,msg:data.message})
    }
    else{
        io.to(user.socketId).emit('alreadyEngaged')
    }
}

let handleCloseChat = (data)=>{
    let temp = []
    temp.push(users.find(user=>user.role=='Agent'))
    users = users.filter(user=>user.role!=='Agent')
    temp.push(...users.filter(user=> user.emailId!==data.email))
    // console.log(temp)
    users = temp
    // console.log(users)
}


export{handleMappingUser,handleSendMsg,handleCloseChat,users}