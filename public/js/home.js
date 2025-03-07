const setupSlidingEffect = () =>{

}


const productContainers = [...document.querySelectorAll('.product-container')];
const nxtBtn = [...document.querySelectorAll('.nxt-btn')];
const preBtn = [...document.querySelectorAll('.pre-btn')];

productContainers.forEach((item, i) => {
    let containerDimenstions = item.getBoundingClientRect();
    let containerWidth = containerDimenstions.width;
    nxtBtn[i].addEventListener('click', () => {
        item.scrollLeft += containerWidth;
    })
    preBtn[i].addEventListener('click', () => {
        item.scrollLeft -= containerWidth;
    })
});

//fetch products cards
const getProducts = (tag) =>{
    return fetch('/get-products', {
        method: 'POST',
        headers: new Headers({"Content-Type" : "application/json"}),
        body: JSON.stringify({tag: tag})
    })
    .then (res => res.json())
    .then(data =>{
        return data;
    })
}

//create product slider
const createProductSlider = (data,parent,title) => {
let slideContainer = document.querySelector(`${parent}`);
slideContainer.innerHTML += `
                 <section class ="product">
                 <h2 class ="product-category">${title}</h2>
                 <button class = "pre-btn"><img src ="../images/arrow.png" alt=""></button>
                 <button class = "nxt-btn"><img src ="../images/arrow.png" alt=""></button>
                 ${createProductCards(data)}
                 </section>
`

setupSlidingEffect();
}

const createProductCards = (data,parent) => {
    let start = '<div class="product-container">';
    let middle = '';
    let end = '</div>';

    for (let i = 0; i < data.length; i++) {
        if (data[i].id !== decodeURI(location.pathname.split('/').pop())) {
            const discount = data[i].discount ? `${data[i].discount}% off` : '';
            const imageSrc = data[i].images && data[i].images.length > 0 ? data[i].images[0] : ''; 

            middle += `
                <div class="product-card">
                    <div class="product-image">
                        <span class="discount-tag">${discount}</span>   
                        <img src="${imageSrc}" class="product-thumb" alt=""> 
                    </div>
                    <div class="product-info" onclick="location.href='/product/${data[i].id}'">
                        <h2 class="product-brand">${data[i].name || ''}</h2>
                        <p class="product-short-des">${data[i].shortDes || ''}</p>
                        <span class="price">${data[i].sellingPrice || ''} SEK</span>
                        <span class="actual-price">${data[i].actualPrice || ''} SEK</span>
                    </div>
                </div>
            `;
        }
    }
    if(parent){
        let cardContainer =document.querySelector(parent);
        cardContainer.innerHTML=start + middle + end;
    } else {
    return start + middle + end;
    }
}

const add_product_to_cart_or_wishlist = (type, product) => {
    let data = JSON.parse(localStorage.getItem(type));
    if(data == null){
        data =[];
    }

    product = {
        item : 1,
        name: product.name,
        sellingPrice: product.sellingPrice,
        shortDes: product.shortDes,
        image: product.images[0]
    }
    data.push(product);
    localStorage.setItem(type, JSON.stringify(data));
    return 'Added';
}