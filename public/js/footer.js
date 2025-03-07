const createFooter = () =>{
    let footer = document.querySelector('footer');

    footer.innerHTML = `
    <div class = "footer-content">
    <img src = "../images/logo-light.png" class = "logo" alt="">
    <div class = "footer-ul-container">
      <ul class = "category">
        <li class = "category-title">Categories</li>
        <li><a href="#" class = "footer-link">Especially for you</a></li>
        <li><a href="#" class = "footer-link">low prices</a></li>
        <li><a href="#" class = "footer-link">TikTok hits</a></li>
        <li><a href="#" class = "footer-link">clothes</a></li>
        <li><a href="#" class = "footer-link">home improvement</a></li>
        <li><a href="#" class = "footer-link">sport and entertainment</a></li>
      </ul>
      <ul class = "category">
        <li class = "category-title">Contact us</li>
        <li class = "footer-contact-info"> Email: nfshop@gmail.com</li>
        <li class = "footer-contact-info"> Telegram: _nfshop_</li>
        <li class = "footer-contact-info"> TikTok: nfshop</li>
      </ul>
    </div>
    </div>
    <p class = "footer-title">about company</p>
    <p class = "info"> Some info Some info Some infoSome infoSome infoSome infoSome
       infoSome infoSome infoSome infoSome infoSome infoSome infoSome infoSome infoSome 
       infoSome infoSome infoSome infoSome infoSome infoSome infoSome infoSome infoSome 
       infoSome infoSome infoSome infoSome infoSome infoSome info</p>
       <div class = "footer-social-container">
        <div>
          <a href="#" class="social-link"> terms & services</a>
          <a href="#" class="social-link"> privacy page</a>
        </div>
       </div>
       <p class = "footer-credit"> NF shop, Best and cheapest online store</p>
    `;
}

createFooter();