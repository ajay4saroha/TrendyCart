
////// login and signup popup ///////
let loginDiv = document.getElementById('loginDiv')
let loginBtn = document.getElementById('LoginBtn')
let registerDiv = document.getElementById('RegisterDiv')
let registerBtn = document.getElementById('RegisterBtn')
let loginClicked = false
let registerClicked = false
function handleShow(prev,current,divName){
    let newClass=divName.getAttribute('class')
    newClass=newClass.replace(prev,current);
    if(!newClass.includes('position-fixed')){
        newClass+=' position-fixed'
    }
    divName.setAttribute('class',`${newClass}`);
}

loginBtn.addEventListener('click',()=>{
    if(loginClicked){
        loginClicked=false
        handleShow('d-block','d-none',loginDiv)
        return
    }
    if(registerClicked){
        registerClicked=false
        handleShow('d-block','d-none',registerDiv)
    }
    handleShow('d-none','d-block',loginDiv)
    loginClicked=true
})

registerBtn.addEventListener('click',()=>{
    if(registerClicked){
        registerClicked=false
        handleShow('d-block','d-none',registerDiv)
        return
    }
    if(loginClicked){
        loginClicked=false
        handleShow('d-block','d-none',loginDiv)
    }
    handleShow('d-none','d-block',registerDiv)
    registerClicked=true
})

////// /register request ///// //
let registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (event) => {
    event.preventDefault(); 

    let formData = new FormData(registerForm); 
    let formDataObject = {};
    
    formData.forEach((value, key) => {
        formDataObject[key] = value;
    });
    let flag = {
        name:false,
        email:false,
        password:false,
        mobile:false,
    }
    if((formDataObject.firstname).trim()){
        flag.name=true
    }
    if((formDataObject.registerEmailId).trim()){
        flag.email=true
    }
    let chkpassword = formDataObject.password
    let passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).+$/;
    if(passwordPattern.test(chkpassword)){
        flag.password=true
    }
    let mobilePattern = /^[0-9]{9}$/;
    if (!mobilePattern.test(formDataObject.mobileNo)) {
        flag.mobile=true
    }
    let finalFlag = true
    if (!flag.name) {
        finalFlag = false
        alert('Enter name properly');
        return;
    }

    if (!flag.email) {
        finalFlag = false
        alert('Enter email properly');
        return;
    }

    if (!flag.mobile) {
        finalFlag = false
        alert('Enter a valid 10-digit mobile number');
        return
    }
    if(!flag.password){
        finalFlag=false
        alert('Password must contain 1 aplhanumeric and 1 special character')
        return
    }
    if(finalFlag==false){
        return
    }
        fetch('/register',{
            method:'post',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify(formDataObject)
        })
        .then(data=>{
            if(data.status==409){
                alert('User already Exist with email address')
            }
            else if(data.status==200){
                alert("Registration Success\n Check your email to verify your account")
                handleShow('d-block','d-none',registerDiv)
            }
            else if(resizeBy.status==400){
                alert('Enter data as mentioned')
            }
            else if(data.status==500){
                alert('Internal Server Error Try Again')
            }
        })
        .catch(err=>console.log(err))
});



/////// LOgin request //////////////
let loginForm = document.getElementById('loginForm')
let loginSignup = document.getElementById('loginSignUpDiv')
let loggedInUser = document.getElementById('loggedInUserDiv')
loginForm.addEventListener('submit',(event)=>{
    event.preventDefault()
    let formData = new FormData(loginForm)
    let formDataObject = {}
    formData.forEach((data,key) => {
        formDataObject[key] = data
    })
    // console.log(formDataObject)
    if(!(formDataObject.LoginEmailId).trim()) {
        alert('Enter your email address') 
        return
    }
    fetch('/login',{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(formDataObject)
    })
    .then(async data=>{
        if(data.status==200){
            data = await data.json()
            let name= document.createElement('p')
            name.innerHTML=data.name
            let userDetails = document.createElement('span')
            let logoutBtn = document.createElement('button')
            logoutBtn.innerHTML='Logout'
            logoutBtn.setAttribute('class','btn btn-outline-danger ms-lg-2')
            logoutBtn.setAttribute('type','button')
            loggedInUser.appendChild(name)
            let logoutAnchor = document.createElement('a')
            logoutAnchor.setAttribute('href','/logout')
            logoutAnchor.appendChild(logoutBtn)
            loggedInUser.appendChild(logoutAnchor)
            loginSignup.setAttribute('style','display:none')
            loggedInUser.setAttribute('style','display:flex')
            handleShow('d-block','d-none',loginDiv)
            location.reload()
        }
        else if(data.status==404){
            alert('User Not Exist')
        }
        else if(data.status==400){
            alert('Wrong Password')
        }
    })
    .catch(err=>{
        console.log(err)
    })
})
