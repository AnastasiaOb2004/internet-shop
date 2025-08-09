const createFooter = () =>{
    let footer = document.querySelector('footer');

    footer.innerHTML = `
    <div class = "footer-content">
    <img src = "../images/logo-light.png" class = "logo" alt="">
    <div class = "footer-ul-container">
      <ul class = "category">
        <li class = "category-title">Categories</li>
<li class="footer-link"><a href="/#especially-for-you" >Especially for you</a></li>
<li class="footer-link"><a href="/#low-prices" >Low prices</a></li>
<li class="footer-link"><a href="/#tiktok-trends" >TikTok Trends</a></li>
<li class="footer-link"><a href="/#clothes" >Clothes</a></li>
      </ul>
      <ul class = "category">
        <li class = "category-title">Contact Us</li>
        <li class = "footer-contact-info"> Email: nfshop@gmail.com</li>
        <li class = "footer-contact-info"> Telegram: _nfshop_</li>
        <li class = "footer-contact-info"> TikTok: nfshop</li>
      </ul>
    </div>
    </div>
    <p class = "footer-title">about company</p>
    <p class = "info"> NF Shop is a modern online marketplace built for everyone. Whether you’re a small business, a creative hobbyist, or just someone looking to declutter, NF Shop makes it easy to sell and shop in one convenient place. Think of it as your own personal store inside a larger shopping mall — you list your products, set your price, and connect directly with customers. <br> With secure payment options, fast shipping support, and tools that help you track your orders, NF Shop ensures both buyers and sellers can trade with confidence. Start selling today and join a growing community that’s turning their products, passions, and ideas into successful online businesses. </p>
       <div class = "footer-social-container">
        <div>
          <a href="#" class="social-link"> terms & services</a>
          <a href="#" class="social-link"> privacy page</a>
        </div>
       </div>
       <p class = "footer-credit"> NF Shop, Best and The Cheapest Online Store</p>
    `;
}

        // <li><a href="#" class = "footer-link">home improvement</a></li>
        // <li><a href="#" class = "footer-link">sport and entertainment</a></li>

createFooter();