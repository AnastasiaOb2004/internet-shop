const setupSlidingEffectForSection = (sectionEl) => {
  if (!sectionEl) return;
  const container = sectionEl.querySelector('.product-container');
  const nxtBtn = sectionEl.querySelector('.nxt-btn');
  const preBtn = sectionEl.querySelector('.pre-btn');

  if (!container) return;

  nxtBtn && nxtBtn.addEventListener('click', () => {
    const width = container.getBoundingClientRect().width;
    container.scrollLeft += width;
  });
  preBtn && preBtn.addEventListener('click', () => {
    const width = container.getBoundingClientRect().width;
    container.scrollLeft -= width;
  });
};

const getProducts = (tag) => {
  const body = tag ? { tag } : {};
  return fetch('/get-products', {
    method: 'POST',
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(body)
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data) return [];
      if (Array.isArray(data)) return data; // defensive
      if (data.products) return data.products;
      if (data.product) return [data.product];
      return [];
    })
    .catch(err => {
      console.error('Fetch error in getProducts:', err);
      return [];
    });
};

const createProductCards = (data) => {
  const start = '<div class="product-container">';
  let middle = '';

  for (let i = 0; i < data.length; i++) {
    if (data[i].id !== decodeURI(location.pathname.split('/').pop())) {
      const discount = data[i].discount ? `${data[i].discount}% off` : '';
      const imageSrc = data[i].images && data[i].images.length > 0 ? data[i].images[0] : '';

      middle += `
        <div class="product-card">
          <div class="product-image">
            <span class="discount-tag">${discount}</span>
            <img src="${imageSrc}" class="product-thumb" onclick="location.href='/product/${data[i].id}' alt="">
          </div>
          <div class="product-info" onclick="location.href='/product/${data[i].id}'">
            <h2 class="product-brand">${data[i].name || ''}</h2>
            <p class="product-short-des">${data[i].shortDes || ''}</p>
            <span class="price">${data[i].sellingPrice || ''}€</span>
            <span class="actual-price">${data[i].actualPrice || ''}€</span>
          </div>
        </div>
      `;
    }
  }

  const end = '</div>';
  return start + middle + end;
};

const createProductSlider = (dataArray, parentSelector, title) => {
  const slideContainer = document.querySelector(parentSelector);
  if (!slideContainer) return;

  let content;
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    content = '<p class="no-products">No products yet</p>';
  } else {
    content = createProductCards(dataArray);
  }

  slideContainer.innerHTML = `
    <section class="product">
      <h2 class="product-category">${title}</h2>
      <button class="pre-btn"><img src="../images/arrow.png" alt=""></button>
      <button class="nxt-btn"><img src="../images/arrow.png" alt=""></button>
      ${content}
    </section>
  `;

  setupSlidingEffectForSection(slideContainer.querySelector('.product'));
};


const add_product_to_cart_or_wishlist = (type, product) => {
  let data = JSON.parse(localStorage.getItem(type));
  if (data == null) data = [];

  product = {
    item: 1,
    name: product.name,
    sellingPrice: product.sellingPrice,
    shortDes: product.shortDes,
    image: product.images ? product.images[0] : ''
  };
  data.push(product);
  localStorage.setItem(type, JSON.stringify(data));
  return 'Added';
};

