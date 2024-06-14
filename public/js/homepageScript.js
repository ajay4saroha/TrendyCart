//////// fetch to load products ////////
let products = []
let skip = 0
let cart = []
async function loadProductsFun(){
    fetch('/loadProducts',{
        method:'post',
        headers:{
            "Content-type":'application/json'
        },
        body:JSON.stringify({skipProducts:skip})
    })
    .then(response=>response.json())
    .then(data=>{
        showProducts(data)
    })
    .catch(err=>console.log(err))
}
loadCart()
loadProductsFun()
let productsGrid = document.getElementById('products-grid')
let loadMoreBtn = document.getElementById('load-more-products-btn')
loadMoreBtn.addEventListener('click',()=>{
    loadProductsFun()
})

/////// show products //////////
function showProducts(data){
    products = data
    if(products.length<5){
        productsGrid.appendChild(displayProducts(0,products.length))
        loadMoreBtn.style.display = "none"
    }
    else{
        productsGrid.appendChild(displayProducts(0,5))    
    }
    skip+=5
}

//////// list product ///////////////
function displayProducts(start,end){
    let productRow = document.createElement('div')
    productRow.setAttribute('class','row')
    for(let i=start;i<end;i++){
        let productDiv = createCard(products[i])
        productRow.appendChild(productDiv)
    }
    return productRow
}

//////////// description button ///////////////
function createDescBtn(obj){
    let btn = document.createElement('button')
    btn.setAttribute('class','btn btn-outline-secondary m-2')
    btn.innerHTML='View Details'
    btn.setAttribute('type','button')
    btn.addEventListener('click',()=>{
        displayDesc(obj)
    })
    return btn
}


/////////add to cart button /////////
function createAddToCartBtn(obj){
    let btn = document.createElement('button')
    btn.setAttribute('class','btn btn-outline-warning m-2')
    btn.innerHTML='<i class="bi bi-cart-plus"></i>'
    btn.setAttribute('type','button')
    btn.setAttribute('id',`${obj.ID}addToCartBtn`)
    btn.addEventListener('click',()=>{
        addToCart(obj)
    })
    return btn
}
////////////// product image /////////////////
function createImage(name){
    let image = document.createElement('img')
    image.setAttribute('src',`uploads/productsImages/${name}`)
    image.setAttribute('class','card-img-top')
    image.setAttribute('height','150px')
    return image
}


/////// product name //////////////
function createTitle(title){
    let heading = document.createElement('strong')
    heading.setAttribute('class','ps-lg-2 ps-sm-1 ps-md-2')
    heading.innerHTML = title
    return heading
}

/////////// product  price //////////////
function createPrice(OrgPrice,disPrice){
    let pricetag = document.createElement('div')
    let p = document.createElement('p')
    let d = document.createElement('span')
    pricetag.setAttribute('class','ps-lg-2 ps-sm-1 ps-md-2')
    p.innerHTML=`$${OrgPrice}`
    d.innerHTML = `${disPrice}`
    if(OrgPrice!==disPrice){
        p.setAttribute('class','text-decoration-line-through')
        pricetag.appendChild(d)
    }
    else{
        pricetag.appendChild(p)
    }
    return pricetag
}

//////// product button div /////////
function createProductBtnDiv(obj){
    let descBtn = createDescBtn(obj)
    let addToCartBtn = createAddToCartBtn(obj)
    let btnDiv = document.createElement('div')
    btnDiv.setAttribute('class','p-1 m-1 d-flex')
    btnDiv.appendChild(addToCartBtn)
    btnDiv.appendChild(descBtn)
    return btnDiv
}
////// product card /////////////
let createCard=(obj)=>{
    let card = document.createElement('div')
    card.setAttribute('class','card col-lg-2 col-md-3 col-sm-6 col-md-2 m-lg-3 m-md-1 m-sm-2')
    card.style='padding:0'
    card.setAttribute('id',obj.ID)
    card.appendChild(createImage(obj.THUMBNAIL))
    card.appendChild(createTitle(obj.NAME))
    let disPrice = (obj.PRICE - obj.PRICE*(obj.DISCOUNT/100)).toFixed(2)
    card.appendChild((createPrice(obj.PRICE,disPrice)))
    card.appendChild(createProductBtnDiv(obj))
    return card
}

//////////// display description /////////////
function displayDesc(obj){
    let descDiv = document.getElementById('description')
    descDiv.style='display:block';
    // createCarousel(obj.images)
    document.getElementById('productName').innerHTML=obj.NAME
    document.getElementById('productBrand').innerHTML=obj.BRAND
    document.getElementById('productCategory').innerHTML=obj.CATEGORY
    document.getElementById('productPrice').innerHTML=obj.PRICE
    document.getElementById('productDescription').innerHTML=obj.DESCRIPTION
    let descBtn = document.getElementById('descBtn')
    descBtn.addEventListener('click',()=>{
      descDiv.style='display:none'  
    })
}

// function createCarousel(data){
//     var carouselContainer = document.getElementById('productCarousel');
//     carouselContainer.className = 'carousel slide';
//     carouselContainer.setAttribute('data-bs-ride', 'carousel');

//     // Create indicators
//     var indicators = document.createElement('div');
//     indicators.className = 'carousel-indicators';

//     for (var i = 0; i < data.length; i++) {
//       var indicator = document.createElement('button');
//       indicator.type = 'button';
//       indicator.setAttribute('data-bs-target', '#productOtherImages');
//       indicator.setAttribute('data-bs-slide-to', i.toString());
//       indicator.setAttribute('aria-label', 'Slide ' + (i + 1));
//       if (i === 0) {
//         indicator.className = 'active';
//         indicator.setAttribute('aria-current', 'true');
//       }
//       indicators.appendChild(indicator);
//     }

//     // Create carousel inner
//     var carouselInner = document.createElement('div');
//     carouselInner.className = 'carousel-inner';
//     carouselInner.style.display='flex'
//     carouselInner.style.justifyContent='center'
//     var images = data

//     images.forEach(function(src, index) {
//       var carouselItem = document.createElement('div');
//       carouselItem.className = 'carousel-item';
//       if (index === 0) {
//         carouselItem.classList.add('active');
//       }
      
//       var img = document.createElement('img');
//       img.src = `uploads/productsImages/${src}`;
//       img.className = 'd-block w-75';
//       img.alt = 'Slide ' + (index + 1);
//       img.setAttribute('height','150px')
//       carouselItem.appendChild(img);
//       carouselInner.appendChild(carouselItem);
//     });

//     // Create control prev
//     var controlPrev = document.createElement('button');
//     controlPrev.className = 'carousel-control-prev';
//     controlPrev.type = 'button';
//     controlPrev.setAttribute('data-bs-target', '#productOtherImages');
//     controlPrev.setAttribute('data-bs-slide', 'prev');
//     controlPrev.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>';

//     // Create control next
//     var controlNext = document.createElement('button');
//     controlNext.className = 'carousel-control-next';
//     controlNext.type = 'button';
//     controlNext.setAttribute('data-bs-target', '#productOtherImages');
//     controlNext.setAttribute('data-bs-slide', 'next');
//     controlNext.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>';

//     // Append elements to the carousel container
//     carouselContainer.appendChild(indicators);
//     carouselContainer.appendChild(carouselInner);
//     carouselContainer.appendChild(controlPrev);
//     carouselContainer.appendChild(controlNext);
//     console.log(carouselContainer)
//     return carouselContainer

// }
///////// addToCart function //////////
function loadCart(){
    fetch('/loadCart',{
        method:'post'
    })
    .then(async res=> {
        if(res.status==404 || res.status==400){
            cart = []
            return
        }
        res=await res.json()
        cart = res
    })
    .catch(err=>console.log(err))
}
function quantityOfProduct(id){
    for(let i=0;i<cart.length;i++){
        if((cart[i]).productId==id){
            return (cart[i]).quantity
        }
    }
    return 0
}
function addToCart(obj){ 
    let reqObj={
        id:obj.ID,
        quantity:quantityOfProduct(obj.ID)+1
    }
    fetch('/addToCart',{
        method:'post',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(reqObj)
    })
    .then(data=>{
        if(data.status==200){
            console.log(obj)
            let btn = document.getElementById(`${obj.ID}addToCartBtn`)
            btn.innerHTML='<i class="bi bi-cart-check"></i>'
            btn.setAttribute('class','btn btn-success m-2')
            // loadCart()
        }
        else if(data.status==304){
            alert('product is removed by seller')
            location.href='/'
        }
        else if(data.status==402){
            alert('Login First')
        }
        else if(data.status==405){
            alert('product is out of stock')
        }
        else{
            alert('Internal Server Error')
        }
    })
    .catch(err=>console.log(err))
}


