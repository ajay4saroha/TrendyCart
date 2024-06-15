
let sellerReqDiv = document.getElementById('sellerReqNav')
// let manageTransporterDiv = document.getElementById('manageTranspotersNav')
let getProductsDiv = document.getElementById('getProductsNav')
let getOrdersDiv = document.getElementById('getOrdersNav')
let addNewAdmin = document.getElementById('addNewAdminNav')
let sellersReport = document.getElementById('getSellersReportNav')
let buyersReport = document.getElementById('getBuyersReportNav')
let mainDiv = document.getElementById('mainContentDiv')
// mainDiv.setAttribute('class','d-flex flex-column justify-content-lg-center')
// let tabs = [sellerReqDiv,managBuyerDiv,getProductsDiv,addNewAdmin]
window.addEventListener('load',fetchReqToGetSeller())

/////conten of all divs //////////////
// getOrdersDiv.addEventListener('click',()=>{
//     hideNewAdminForm()
//     fetchReqToGetOrders()
// })

sellerReqDiv.addEventListener('click',()=>{
    hideNewAdminForm()
    fetchReqToGetSeller()
    // displayTargetedDiv(sellerReqDiv)
})
// manageTransporterDiv.addEventListener('click',()=>{
//     hideNewAdminForm()
//     mainDiv.innerHTML='transporters'
//     // fetchReqToGetBuyers()
//     // displayTargetedDiv(managBuyerDiv)
// })
getProductsDiv.addEventListener('click',()=>{
    hideNewAdminForm()
    fetchReqToGetProducts()
    // displayTargetedDiv(getProductsDiv)
})
addNewAdmin.addEventListener('click',()=>{
     mainDiv.innerHTML = ''
     let formDiv = document.getElementById('newAdminFormDiv')
     formDiv.style.display='block'
     let addNewAdminForm = document.getElementById('addNewAdmin')
     addNewAdminForm.addEventListener('submit',(event)=>{
        event.preventDefault()
        let formData = new FormData(addNewAdminForm)
        let reqObj = {}
        formData.forEach((val,key) => {
            reqObj[key] = val
        });
        if(!reqObj.firstname.trim()){
            alert('Enter Your Name Properly')
            return
        }
        if(!reqObj.emailId.trim()){
            alert('Enter email')
            return
        }
        const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).+$/;
        if(!passwordPattern.test(reqObj.password)){
            alert('Password not in proper format')
            return
        }
        fetch('/addNewAdmin',{
            method:'post',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify(reqObj)
        })
        .then(res=>{
            if(res.status==200){
                alert('Admin added Success')
            }
            else if(res.status==400){
                alert('User already Exist with same email address')
                location.href = '/adminDashboard'
            }
            else if(res.status==500){
                alert('Internal Server Error')
            }
        })
        .catch(err=>{
            console.log(err)
            alert('Try Again')
        })
     })
})
function hideNewAdminForm(){
    let formDiv = document.getElementById('newAdminFormDiv')
     formDiv.style.display='none'
}

sellersReport.addEventListener('click',()=>{
  hideNewAdminForm()
  fetchReqToGetSellersReport()
})

buyersReport.addEventListener('click',()=>{
    hideNewAdminForm()
    fetchReqToGetBuyersReport()
})
////// create table header ////
function createTableHeader(arr){
    let thead = document.createElement('thead')
    let y = document.createElement('th')
    y.setAttribute('class','p-lg-3 p-md-1 p-sm-1 border border-primary')
    y.innerHTML='S.No'
    thead.appendChild(y)
    for(let i=0;i<arr.length;i++){
        if(arr[i]=='Domains' || arr[i]=='ReceviedAt' || arr[i]=='ActionAt' || arr[i]=='id'){
            continue
        }
        if(arr[i]=='phoneNumber'){
            arr[i] = 'Phone'
        }
        else if(arr[i]=='billingAmount'){
            arr[i] = 'Cost'
        }
        let th = document.createElement('th')
        th.setAttribute('class','p-lg-2 p-md-1 p-sm-1 border border-primary')
        th.innerHTML = arr[i]
        thead.appendChild(th)
    }
    if(arr.length>4){
        let th = document.createElement('th')
        th.setAttribute('class','p-lg-3 p-md-1 p-sm-1 border border-primary')
        th.innerHTML = 'Action'
        thead.appendChild(th)
    }
    return thead
}


function createBtn(obj,action){
    let btn = document.createElement('button')
    switch(action){
        case 'Suspend':{
            btn.setAttribute('class','m-1 p-lg-2 p-md-1 p-sm-1 fs-6 btn btn-outline-warning')
            break
        }
        case 'Approve':{
            btn.setAttribute('class','m-1 p-lg-2 p-md-1 p-sm-1 fs-6 btn btn-outline-success')
            break
        }
        case 'Reject':{
            btn.setAttribute('class','m-1 p-lg-2 p-md-1 p-sm-1 fs-6 btn btn-outline-danger')
            break
        }
    }
    btn.setAttribute('id',`${obj.EmailId}-${action}`)
    btn.addEventListener('click',()=>{
        let btnId = btn.getAttribute('id')
        let emailId = btnId.replace(`-${action}`,'')
        let btnAction = btnId.replace(`${emailId}-`,'')
        console.log(emailId,btnAction)
        decideActionAndFetchReq(emailId,btnAction)
    })
    btn.innerHTML=action.toUpperCase()
    btn.setAttribute('type','button')
    return btn
}



///// create table row /////
function createRow(obj,count){
    let tr = document.createElement('tr')
    tr.setAttribute('class','text-center')
    let x = document.createElement('td')
    x.setAttribute('class','p-lg-1 p-md-1 p-sm-1 border border-primary')
    x.innerHTML = count
    tr.appendChild(x)
    for(let key in obj){
        if(key=='Domains' || key=='ReceviedAt' || key=='ActionAt' || key=='id'){
            continue
        }
        let td = document.createElement('td')
        td.setAttribute('class','p-lg-2 p-md-1 p-sm-1 border border-primary')
        td.innerHTML = obj[key]
        tr.appendChild(td)
    }
    let td = document.createElement('td')
    td.setAttribute('class','p-lg-2 p-md-1 p-sm-1 border border-primary')
    let action
    switch(obj.Status){
        case 'Approved':{
                action='Suspend'
                td.appendChild(createBtn(obj,action)) 
                break;
        }
        case 'Suspended'||'Rejected':{
                action = 'Approve'
                td.appendChild(createBtn(obj,action))
                break;
        }
        case 'Pending':{
            let btnDiv = document.createElement('div')
            let approveBtn = createBtn(obj,'Approve')
            let rejectBtn = createBtn(obj,'Reject')
            btnDiv.setAttribute('class','d-flex flex-column')
            btnDiv.appendChild(approveBtn)
            btnDiv.appendChild(rejectBtn)
            td.appendChild(btnDiv)
            break
        }
    }
    
    if(obj.listed==0 || obj.listed==1){
        function createProductBtn(obj){
            let btn = document.createElement('button')
            btn.setAttribute('class','m-1 p-lg-2 p-md-1 p-sm-1 fs-6 btn btn-outline-danger')
            btn.setAttribute('id',obj.id)
            btn.addEventListener('click',()=>{
                adminActionRemoveProduct(btn.getAttribute('id'))
            })
            btn.innerHTML = 'REMOVE'
            return btn
        }
        td.appendChild(createProductBtn(obj))
        tr.appendChild(td)
    }
    if(Object.keys(obj).length>4){
        tr.appendChild(td)   
    }
    return tr
}


////// FETCH REQ TO REMOVE ENTIRE PRODUCT ////
function adminActionRemoveProduct(id){
    fetch('/removeEntireProduct',{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({productId:id})
    })
    .then(res=>{
        if(res.status==200){
            alert('Product Removed successfully')
            fetchReqToGetProducts()
        }
        else if(res.status==500){
            alert('Internal Server Error')
        }
    })
    .catch(err=>{
        console.log(err)
    })
}



///// PRODUCT REQ FOR ACTION //////

function fetchReqToGetProducts(){
    fetch('/getAllProducts',{
        method:'post',
    })
    .then(async res=>{
        data = await res.json()
        displayProducts(data)
    })
    .catch(err=>{
        console.log(err)
    })
}

function displayProducts(data){
    let table = document.createElement('table')
    table.setAttribute('class','m-lg-3 m-md-2 m-sm-1')
    let tableHeader = createTableHeader(Object.keys(data[0]))
    table.appendChild(tableHeader)
    for(let i=0;i<data.length;i++){
        let row = createRow(data[i],i+1)
        table.appendChild(row)
    }
    mainDiv.innerHTML='<h1 class="text-center text-decoration-underline">PRODUCTS DETAILS</h1>'
    mainDiv.appendChild(table)
}


///// SELLER REQ FOR ACTION //////
function fetchReqToGetSeller(){
    fetch('/getAllSellers',{
        method:'post',
    })
    .then(res=>{
        if(res.status==200){
            res.json().then(data=>{
                showSellerInfo(data)
            })
        }
        else if(res.status==500){
            alert('Internal Server Error')
        }
    })
    
}

function showSellerInfo(data){
    let table = document.createElement('table')
    table.setAttribute('class','m-lg-3 m-md-2 m-sm-1')
    let tableHeader = createTableHeader(Object.keys(data[0]))
    table.appendChild(tableHeader)
    for(let i=0;i<data.length;i++){
        let row = createRow(data[i],i+1)
        table.appendChild(row)
    }
    mainDiv.innerHTML='<h1 class="text-center text-decoration-underline">SELLER DETAILS</h1>'
    mainDiv.appendChild(table)
}

///// SELLER REPORT REQ ////
function fetchReqToGetSellersReport(){
    fetch('getSellersReportForAdmin')
    .then(async res=>{
        if(res.status==500){
            alert('Error Occured')
            return
        }
        res = await res.json()
        displayReport(res,'Seller')
    })
    .catch(err=>{
        console.log(err)
    })
}

function displayReport(data,title){
    let table = document.createElement('table')
    table.setAttribute('class','m-lg-3 m-md-2 m-sm-1')
    let tableHeader = createTableHeader(Object.keys(data[0]))
    table.appendChild(tableHeader)
    for(let i=0;i<data.length;i++){
        let row = createRow(data[i],i+1)
        table.appendChild(row)
    }
    if(title=='Seller'){
         mainDiv.innerHTML='<h1 class="text-center text-decoration-underline">TOP SELLERS ORDER WISE</h1>'
    }
    else{
         mainDiv.innerHTML='<h1 class="text-center text-decoration-underline">TOP BUYERS AMOUNT WISE</h1>'
    }
    mainDiv.appendChild(table)
}


/////// BUYERS REPORT REQ ///////
function fetchReqToGetBuyersReport(){
    fetch('/getBuyersReportForAdmin')
    .then(async res=>{
        if(res.status==500){
            alert('Error Occured')
            return
        }
        if(res.status==400){
            location.href='/adminDashboard'
        }
        res = await res.json()
        displayReport(res,'buyers')
    })
    .catch(err=>{
        console.log(err)
    })
}



/////// fetch req on admin action /////
function decideActionAndFetchReq(email,action){
    switch(action){
        case 'Suspend':{
            fetchReqSuspend(email)
            break;
        }
        case 'Approve':{
            fetchReqApprove(email)
            break
        }
        case 'Reject':{
            fetchReqReject(email)
        }
    }
}

////// general function for fetch req ////
function fetchReqSend(url,email){
    fetch(`${url}`,{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({emailId:email})
    })
    .then(res=>{
        if(res.status==200){
            location.href='/adminDashboard'
        }
        else if(res.status==500){
            alert('Internal Server Error\ntry again after some time')
        }
    })
    .catch(err=>{
        console.log(err)
    })
}

/// suspend seller req////
function fetchReqSuspend(email){
    fetchReqSend('/suspendSeller',email)
}

function fetchReqApprove(email){
    fetchReqSend('/approveSeller',email)
}

function fetchReqReject(email){
    fetchReqSend('/rejectSeller',email)
}

