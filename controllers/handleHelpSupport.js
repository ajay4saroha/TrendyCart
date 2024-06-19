import { io } from "../server.js"
import { handleMappingUser,handleSendMsg } from "./handleSocket.js"
let users = []
let connectSocket = (socket)=>{
    socket.on('mapEmailAndSocket',handleMappingUser)
    socket.on('sendMsgTo',handleSendMsg)
}
export{connectSocket,users}