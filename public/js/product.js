const productImages = document.querySelectorAll(".product-images img");
const productImagesSlide = document.querySelector(".image-slider");

let activeImage = 0;

productImages.forEach((item,i) => {
     item.addEventListener('click', ()=>{
    productImages[activeImage].classList.remove('active');
     item.classList.add('active')
     productImagesSlide.style.backgroundImage = `url('${item.src}')`;
     activeImage = i;
     })
})

const setData = (data) => {
     let title = document.querySelector('title');

     //setup the images
     productImages.forEach((img,i) => {
          if(data.images[i]){
               img.src = data.images[i];
          } else {
               img.style.display = 'none';
          }
     })
     productImages[0].click();

     //setting up texts
     const name = document.querySelector('.product-brand');
     const shortDes = document.querySelector('.product-short-des');
     const des = document.querySelector('.des');

     title.innerHTML += name.innerHTML = data.name;
     shortDes.innerHTML += data.shortDes;
     des.innerHTML += data.des;

     //pricing
     const sellingPrice = document.querySelector('.product-price');
     const actualPrice = document.querySelector('.product-actual-price');
     const discount = document.querySelector('.product-discount');

     sellingPrice.innerHTML = `${data.sellingPrice} SEK`;
     actualPrice.innerHTML = `${data.actualPrice} SEK`;
     discount.innerHTML = `( ${data.discount}% off )`;

     //wishlist and cart btn
     const wishListBtn = document.querySelector('.wishlist-btn');
     wishListBtn.addEventListener('click', () =>{
          wishListBtn.innerHTML = add_product_to_cart_or_wishlist('wishlist',data);
     })

     const cartBtn = document.querySelector('.cart-btn');
     cartBtn.addEventListener('click', () =>{
          cartBtn.innerHTML = add_product_to_cart_or_wishlist('cart',data);
     })
}


fetchProductData = () => {
  fetch('/get-products', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify({id: productId})
  })
  .then(res => res.json())
  .then(data => {
    setData(data.product);  // pass only the product object, not the whole response
    getProducts(data.product.tags[1])
      .then(list => createProductSlider(list, '.container-for-card-slider', 'Similar Products'));
  });
}


let productId = null;
if(location.pathname != '/product'){
     productId = decodeURI(location.pathname.split('/').pop());
     fetchProductData();
}