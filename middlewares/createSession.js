import session from "express-session";
let createSession = session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:false
})
export{createSession}