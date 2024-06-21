import { io } from "../server.js"
import { handleMappingUser,handleSendMsg,handleCloseChat } from "./handleSocket.js"

let connectSocket = (socket)=>{
    socket.on('mapEmailAndSocket',handleMappingUser)
    socket.on('sendMsgTo',handleSendMsg)
    socket.on('closeChat',handleCloseChat)
}
export{connectSocket}