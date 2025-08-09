const createNav= () => {
    let nav = document.querySelector('.navbar');
    nav.innerHTML = `
    <div class="nav">
     <a href="../index.html"><img src="../images/logo.png" class="brand-logo" alt=""></a>
    <div class="nav-items">
        <div class="search">
            <input type="text" class="search-box" placeholder="I'm looking for...">
            <button class="search-btn">search</button>
        </div>
        <a>
              <img src="../images/user.png" id ="user-img" alt="">
              <div class="login-logout-popup hide">
              <p class="account-info">Log in as, name</p>
              <button class ="btn" id="user-btn">Log out </button>
              </div>
        </a>
        <a href="/cart"><img src="../images/cart.png" alt=""></a>
    </div>
</div>
<ul class = "link-container">
<li class="link-item"><a href="/#especially-for-you" class="link">Especially for you</a></li>
<li class="link-item"><a href="/#low-prices" class="link">Low prices</a></li>
<li class="link-item"><a href="/#tiktok-trends" class="link">TikTok Trends</a></li>
<li class="link-item"><a href="/#clothes" class="link">Clothes</a></li>
</ul>
    `;
}
createNav();

 //     <ul class="sub-menu">
    //       <li><a href="#">Man Clothes</a></li>
    //       <li><a href="#">Woman Clothes</a></li>
    //       <li><a href="#">Kids Clothes</a></li>
    //     </ul>
    //   </li>
    // <li class = "link-item"><a href = "#" class = "link">Home improvement</a></li>
    // <li class = "link-item"><a href = "#" class = "link">Sport and entertainment</a></li>

//nav popup
const userImageButton = document.querySelector('#user-img');
const userPopup = document.querySelector('.login-logout-popup');
const popupText = document.querySelector('.account-info');
const actionBtn = document.querySelector('#user-btn');

userImageButton.addEventListener('click', () => {
    userPopup.classList.toggle('hide');
})

window.onload = () =>{
    let user = JSON.parse(sessionStorage.user || null);
    if(user != null)
    {
      popupText.innerHTML=  `Logged in as ${user.name}`;
      actionBtn.innerHTML = 'log out';
      actionBtn.addEventListener('click', () => {
        sessionStorage.clear();
        location.reload();
      })
    } else {
    popupText.innerHTML = 'Log in to place order';
    actionBtn.innerHTML = 'Log in';
    actionBtn.addEventListener('click', () => {
        location.href = '/login';
    })
    }
}


//search box
const searchBtn = document.querySelector('.search-btn');
const searchBox  = document.querySelector('.search-box');
searchBtn.addEventListener('click', () => {
    if(searchBox.value.length){
        location.href = `/search/${searchBox.value}`
    }
})