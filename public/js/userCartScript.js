///////////// remove product ///////////
function removeProduct(id){
    let vol = document.getElementById(`${id}-NoOfItems`).innerHTML
    sendReq('/removeProductFromUserCart',{productId:id,quantityOfProduct:parseInt(vol)})
    .then(res=>{
        if(res.status==200){
            location.href='/showUserCart'
        }
        else{
            console.log(res.status)
        }
    })
    .catch(err=>console.log(err))
}


////////////// change in  quantity ////////////
function changeInQuantity(id,update){
    sendReq('/changeInQuantity',{productId:id,updateCmd:update})
    .then(res=>{
        if(res.status==200){
            let count = parseInt(document.getElementById(`${id}-NoOfItems`).innerHTML)
            if(update=='increment'){
                document.getElementById(`${id}-NoOfItems`).innerHTML= ++count
            }
            else if(update=='decrement'){
                if(count==1){
                    return removeProduct(id)
                }
                else{
                    document.getElementById(`${id}-NoOfItems`).innerHTML= --count
                }
            }
        }
        else if(res.status==304){
            alert('product has been removed by seller')
            document.getElementById(`${id}-NoOfItems`).innerHTML= 0
        }
        else if(res.status==302){
            location.href='/showUserCart'
        }
        else if(res.status==305){
            alert('Out of Stock')
        }
        else{
            alert('Internal Server Error')
        }
    })
}




///////////// fetch req //////////
function sendReq(url,obj){
    return fetch(`${url}`,{
        method:'post',
        headers:{
            "Content-type":"application/json"
        },
        body:JSON.stringify(obj)
    })
}


////// prepare order req ////
function disableBtns(arr){
    for(let i=0;i<arr.length;i++){
       
    }
}
let orderBtn = document.getElementById('prepareOrderBtn')
orderBtn.addEventListener('click',()=>{
    fetch('/prepareOrderForUser',{
        redirect:'follow'
    })
    .then(async res=>{
        // console.log(res)
        if(res.redirected){
            window.location.href = res.url
        } else {
            console.log("error while redirecting")
        }
        // res = await res.json()
    })
    .catch(err=>{
        console.log(err)
    })
})
