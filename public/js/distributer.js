let ordersDiv = document.getElementById('manageOrdersNav')
let mainDiv = document.getElementById('mainContentDiv')
window.addEventListener('load',()=>{
    fetchGetOrders()
})
ordersDiv.addEventListener('click',()=>{
    fetchGetOrders()
})

////// get all orders from seller /////
function fetchGetOrders(){
    fetch('/getOrderReadyForDelivery')
    .then(async res=>{
        if(res.status==500){
            alert('Internal server error')
            return
        }
        else if(res.status==304){
            alert('No orders for you')
            return
        }
        res=await res.json()
        displayOrders(res)
    })
    .catch(err=>{
        console.log(err)
    })
}


function displayOrders(data){
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

function fetchReqOutForDelivery(btn){
    let id = btn.getAttribute('id').replace('_Deliver','')
    fetch('/sendOrderForDelivery',{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({Id:id})
    })
    .then(()=>{
        fetchGetOrders()
    })
    .catch(err=>{
        console.log(err)
    })
}

function fetchReqForDeliverySuccess(btn){
    let id = btn.getAttribute('id').replace('_Delivered','')
    fetch('/orderDelivered',{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({Id:id})
    })
    .then(()=>{
        fetchGetOrders()
    })
    .catch(err=>{
        console.log(err)
    })
}

//////// create row ////////
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
    let outForDeliveryBtn = createBtn(obj,'Deliver')
    let deliverdBtn = createBtn(obj,'Delivered')
    if(obj.outForDeliveryAt){
        outForDeliveryBtn.disabled=true
        if(obj.deliveredAt){
            deliverdBtn.disabled=true;
        }
        else{
            deliverdBtn.addEventListener('click',()=>{
                fetchReqForDeliverySuccess(deliverdBtn)
            })
        }
    }
    else{
        deliverdBtn.disabled = true
        outForDeliveryBtn.addEventListener('click',()=>{
            fetchReqOutForDelivery(outForDeliveryBtn)
        })
    }
    td.appendChild(outForDeliveryBtn)
    td.appendChild(deliverdBtn)
    tr.appendChild(td)
    return tr
}


//// create table headers ////
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
    let th = document.createElement('th')
    th.setAttribute('class','p-lg-3 p-md-1 p-sm-1 border border-primary')
    th.innerHTML = 'Action'
    thead.appendChild(th)
    return thead
}


/////// create btns ////////////
function createBtn(obj,action){
    let btn = document.createElement('button')
    switch(action){
        case 'Deliver':{
            btn.setAttribute('class','m-1 p-lg-2 p-md-1 p-sm-1 fs-6 btn btn-outline-warning')
            break
        }
        case 'Delivered':{
            btn.setAttribute('class','m-1 p-lg-2 p-md-1 p-sm-1 fs-6 btn btn-outline-success')
            break
        }
    }
    btn.setAttribute('id',`${obj.id}_${action}`)
    btn.innerHTML=action.toUpperCase()
    btn.setAttribute('type','button')
    return btn
}
