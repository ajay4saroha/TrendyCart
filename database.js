import mysql from 'mysql2/promise'
let connect
function connectDB(){
    try {
        console.log('DB CONNECTING...', process.env.DB_HOST_NAME)
        connect = mysql.createPool({
            host: process.env.DB_HOST_NAME,
            port: process.env.DB_PORT,
            user: process.env.DB_USER_NAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        })
        console.log('DB CONNECTED')
    } catch (error) {
        console.log(error)
    }
}
 export{connect,connectDB}