
let placeOrder = document.getElementById('placeOrderBtn')
let cancelOrder = document.getElementById('cancelOrderBtn')
placeOrder.addEventListener('click',()=>{
    placeOrder.disabled=true
    cancelOrder.disabled=true
    let address = prompt("Enter delivery Address if it's another address")
    fetch('/placeOrder',{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify({address:address})
    })
    .then(res=>{
        if(res.status=200){
            alert('Order placed success')
            location.href = '/'
        }
        else if(res.status==500){
            alert('Internal server errror')
        }
        else{
            alert('Order not placed try after sometime')
        }
    })
    .catch(err=>{
        alert(err)
    })
})
cancelOrder.addEventListener('click',()=>{
    fetch('/cancelOrder',{
        redirect:'follow'
    })
    .then(res=>{
        if(res.status==500){
            alert('Internal server error')
        }
        else{
            location.href= res.redirect
        }
    })
    .catch(err=>{
        console.log(err)
    })
})
