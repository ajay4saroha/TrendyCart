let mainDiv = document.getElementById('mainContentDiv')
let windowLoaded = false
if(!windowLoaded){
    fetchReqForListedProduct()
    windowLoaded=true
}

///////// create row //////
function createRow(obj,count){
    let tr = document.createElement('tr')
    let x = document.createElement('td')
    x.setAttribute('class','p-lg-1 p-md-1 p-sm-1 border border-primary')
    x.innerHTML = count
    tr.appendChild(x)
    for(let key in obj){
        if(key=='__v' || key=='thumbnailImg' || key=='images' || key=='sellerEmailId' || key=='ID' || key=='createdAt' || key=='updatedAt'){
            continue
        }
        if(key=='PRICE'){
            obj[key] = parseFloat(obj[key]).toFixed(2)
        }
        let td = document.createElement('td')
        td.setAttribute('class','p-lg-2 p-md-1 p-sm-1 border border-primary')
        td.innerHTML = obj[key]
        tr.appendChild(td)
    }
    let td = document.createElement('td')
    td.setAttribute('class','p-lg-3 p-md-1 p-sm-1 border border-primary')
    if(Object.keys(obj).length>6){
        let btnDiv = createProductBtnDiv(obj)
        td.appendChild(btnDiv)
    }
    else{
        let btn = createBtn(obj,'dispatch')
        td.appendChild(btn)
    }
    tr.appendChild(td)
    return tr
}

/////// display update form ////////////
function showUpdateForm(updateFormDiv){
    if(updateFormDiv.style.display=='none'){
        updateFormDiv.style.display='block'
    }
}

function displayUpdateDiv(obj){
    console.log(obj)
    let updateFormDiv = document.getElementById('updateProductFormDiv')
    let updateForm = document.getElementById('updateProductDetailsForm')
    let updateFormClose = document.getElementById('updateFormDivClose')
    let updateFormSubmitBtn = document.getElementById('updateFormSubmitBtn')
    updateFormClose.addEventListener('click',()=>{
        updateFormDiv.style.display='none'
        updateForm.setAttribute('id','updateProductDetailsForm')
    })
    if(updateFormDiv.style.display=='none'){
        updateFormDiv.style.display='block'
    }
    let name = document.getElementById(`updateFormProductName`)
    let price = document.getElementById(`updateFormProductPrice`)
    let brand = document.getElementById(`updateFormProductBrand`)
    let volume = document.getElementById(`updateFormProductVolume`)
    let description = document.getElementById(`updateFormProductDesc`)
    let listed = document.getElementById(`prductAvailabilityTrue`)
    let notListed = document.getElementById(`prductAvailabilityFalse`)
    let discount = document.getElementById('updateFormProductDiscount')
    name.setAttribute('value',`${obj.NAME}`)
    price.setAttribute('value',`${obj.PRICE}`)
    brand.setAttribute('value',`${obj.BRAND}`)
    volume.setAttribute('value',`${obj.VOLUME}`)
    discount.setAttribute('value',`${obj.DISCOUNT}`)
    description.innerHTML=`${obj.DESCRIPTION}`
    if(obj.LISTED){
        listed.checked=true
    }
    else{
        notListed.checked=true
    }
    updateFormSubmitBtn.replaceWith(updateFormSubmitBtn.cloneNode(true));
    updateFormSubmitBtn = document.getElementById('updateFormSubmitBtn');

    updateFormSubmitBtn.addEventListener('click',(event)=>{
        event.preventDefault()
        let formData = {
            id: obj.ID,
            name: name.value.trim(),
            price: parseInt(price.value),
            brand: brand.value.trim(),
            volume: volume.value.trim(),
            discount:discount.value,
            listed: listed.checked,
            description: description.value.trim()
        };
        if (!formData.name) {
            alert('Enter name');
            return;
        }
        if(formData.discount<0 && formData>100){
            alert('Enter discount properly')
            return;
        }
        if (formData.price<0 || formData.price===0){
            alert('Enter price');
            return;
        }
        if (!formData.brand) {
            alert('Enter brand');
            return;
        }
        if (!formData.volume) {
            alert('Enter volume');
            return;
        }
        fetch('/insertNewProductDetails',{
            method:'post',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify(formData)
        })
        .then(res=>{
            if(res.status==200){
                alert('Product updated successfully')
                location.href='/sellerDashboard'
            }
            else if(res.status==400){
                alert('Enter data properly with suitable datatype')
            }
            else if(res.status==500){
                alert('Internal server error')
            }
        })
        .catch(err=>console.error(err))
    })
}


/////////// update product details ////////
function updateProductDetails(id){
    fetch('/updateProductDetails',{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({productId:id})
    })
    .then(async res=>{
        if(res.status==404){
            alert('product not present in database')
            location.href='/sellerDashboard'
            return
        }
        let data = await res.json()
        displayUpdateDiv(data.product)
    })
    .catch(err=>{
        console.log(err)
    })
}

//////// delete product ///////////////
function deleteProduct(id){
    fetch('/deleteProduct',{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({productId:id})
    })
    .then(res=>{
        if(res.status==200){
            alert('Product deleted successfully')
            location.href = '/sellerDashboard'
        }
        else if(res.status==500){
            alert('Internal server error')
        }
    })
    .catch(err=>console.log(err))
}

/////////// disptach order ///////
function dispatchOrder(obj){
    fetch('/dispatchOrder',{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({orderId:obj.ID,productId:obj.PRODUCT,volume:obj.VOLUME})
    })
    .then(res=>{
        if(res.status==200){
            let btn = document.getElementById(`${obj.ID}-dispatch-btn`)
            btn.setAttribute('class','btn btn-success')
            btn.innerHTML = 'DISPATCHED'
            btn.disabled = true
            fetchReqToGetOrders()
        }
        else if(res.status==500){
            alert('Error occured please try after sometime')
        }
    })
    .catch(err=>{
        console.log(err)
    })
}



///////////// create btn //////////
function createBtn(obj,action){
    let btn = document.createElement('button')
    btn.setAttribute('id',`${obj.ID}-${action}-btn`)
    if(action=='delete'){
        btn.setAttribute('class','btn btn-outline-danger m-2')
        // btn.setAttribute('onclick',`updateProductDetails(${obj.ID})`)
        /// delete btn event ////
        btn.addEventListener('click',()=>{
            let id = btn.getAttribute('id').replace('-delete-btn','')
            deleteProduct(id)
        })
    }
    else if(action=='update'){
        btn.setAttribute('class','btn btn-outline-primary m-2')
        // btn.setAttribute('onclick',`deleteProduct(${obj.ID})`)
        //// update btn event /////
        btn.addEventListener('click',()=>{
            let id = btn.getAttribute('id').replace('-update-btn','')
            updateProductDetails(id)
        })
    }
    else{
        if(obj.DISPATCHEDAT){
            btn.setAttribute('class','btn btn-success')
            btn.disabled = true
            action = 'DISPATCHED'
        }
        else{
            btn.setAttribute('class','btn btn-outline-success')
            btn.addEventListener('click',()=>{
                let id = btn.getAttribute('id').replace('-dispatch-btn','')
                dispatchOrder(obj)
            })
            action = 'DISPATCH'
        }
    }
    btn.innerHTML=action.toUpperCase()
    btn.setAttribute('type','button')
    return btn
}



///////////// create btns div //////////
function createProductBtnDiv(obj){
    let updateBtn = createBtn(obj,'update')
    let deleteBtn = createBtn(obj,'delete')
    let btnDiv = document.createElement('div')
    btnDiv.setAttribute('class','p-1 m-1')
    btnDiv.appendChild(updateBtn)
    btnDiv.appendChild(deleteBtn)
    return btnDiv
}



///////// create table header //////
function createTableHeader(arr){
    let thead = document.createElement('thead')
    let y = document.createElement('th')
    y.setAttribute('class','p-lg-3 p-md-1 p-sm-1 border border-primary')
    y.innerHTML='s.No'
    thead.appendChild(y)
    for(let i=0;i<arr.length;i++){
        if(arr[i]=='__v' || arr[i]=='thumbnailImg' || arr[i]=='images' || arr[i]=='sellerEmailId' || arr[i]=='ID' || arr[i]=='createdAt' || arr[i]=='updatedAt'){
            continue
        }
        let th = document.createElement('th')
        th.setAttribute('class','p-lg-3 p-md-1 p-sm-1 border border-primary')
        th.innerHTML = arr[i]
        thead.appendChild(th)
    }
    let th = document.createElement('th')
    th.setAttribute('class','p-lg-3 p-md-1 p-sm-1 border border-primary')
    th.innerHTML = 'Action'
    thead.appendChild(th)
    return thead
}


///////// fetch req for listed products ////////////
function fetchReqForListedProduct(){
    fetch('/listedProducts')
    .then(async res => {
        if(res.status==500){
            alert('Internal Server Error')
            return
        }
        dispNone()
        res = await res.json()
        if(!res || res.length===0){
            mainDiv.innerHTML = '<h1 class="text-center">Product not added yet</h1>'
            return
        }
        
        let div = document.createElement('div')
        let table = document.createElement('table')
        table.setAttribute('class','p-lg-3 p-md-2 p-sm-2 border border-dark text-center')
        let tableHeader = createTableHeader(Object.keys(res[0]))
        table.appendChild(tableHeader)
        let tableBody = document.createElement('tbody')
        for(let i=0;i<res.length;i++){
            let p = createRow(res[i],i+1)
            tableBody.appendChild(p)
        }
        table.appendChild(tableBody)
        mainDiv.innerHTML = ''
        let heading = document.createElement('h1')
        heading.setAttribute('class','text-center text-decoration-underline p-lg-3 p-md-2 p-sm-1')
        heading.innerHTML = 'LISTED PRODUCTS'
        mainDiv.appendChild(heading)
        mainDiv.appendChild(table)
    })
    .catch(err=>console.log(err))
}


let listedProductsReq = document.getElementById('listedProducts')
listedProductsReq.addEventListener('click',()=>{
    fetchReqForListedProduct()
})



//////// add new product ///////////////
function dispNone(){
    formDiv.style.display='none'
}
let formDiv = document.getElementById('addNewProductFormDiv')
let dispAddProductForm = document.getElementById('displayAddProductForm')
dispAddProductForm.addEventListener('click',()=>{
    mainDiv.innerHTML=''
    formDiv.style.display='block'
})

///////// DISPLAY ALL ORDERS /////////
let ordersDiv = document.getElementById('ordersDiv')
ordersDiv.addEventListener('click',()=>{
    fetchReqToGetOrders()
})

function fetchReqToGetOrders(){
    fetch('/getSellerOrders')
    .then(async res=>{
        res = await res.json()
        dispNone()
        displayOrders(res)
    })
    .catch(err=>{
        console.log(err)
        alert('Error Occured')
    })
}

function displayOrders(data){
    if(data.length>0){
        let div = document.createElement('div')
        let table = document.createElement('table')
        table.setAttribute('class','p-lg-3 p-md-2 p-sm-2 border border-dark text-center')
        let tableHeader = createTableHeader(Object.keys(data[0]))
        table.appendChild(tableHeader)
        let tableBody = document.createElement('tbody')
        for(let i=0;i<data.length;i++){
            let p = createRow(data[i],i+1)
            tableBody.appendChild(p)
        }
        table.appendChild(tableBody)
        mainDiv.innerHTML = ''
        let heading = document.createElement('h1')
        heading.setAttribute('class','text-center text-decoration-underline p-lg-3 p-md-2 p-sm-1')
        heading.innerHTML = 'ORDERS'
        mainDiv.appendChild(heading)
        mainDiv.appendChild(table)
    }
}

///// get reporting ///////
let getReporting = document.getElementById('ReportDiv')
getReporting.addEventListener('click',()=>{
    dispNone()
    fetchReqForReporting()
})


