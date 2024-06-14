import mysql from 'mysql2/promise'
let connect
function connectDB(){
    try {
        connect = mysql.createPool({
            host:'localhost',
            port:3306,
            user:'root',
            password:'root123',
            database:'ecommerce'
        })
        console.log('DB CONNECTED')
    } catch (error) {
        console.log(error)
    }
}
 export{connect,connectDB}