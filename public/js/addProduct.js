let user = JSON.parse(sessionStorage.user || 'null');

window.onload = () => {
  if (user) {
    if (!compareToken(user.authToken, user.email)) {
      location.replace('/login');
    }
  } else {
    location.replace('/login');
  }
};

const actualPrice = document.querySelector('#actual-price');
const discountPercentage = document.querySelector('#discount');
const sellingPrice = document.querySelector('#sell-price');

discountPercentage.addEventListener('input', () => {
  if (discountPercentage.value > 100) {
    discountPercentage.value = 90;
  } else {
    let discount = actualPrice.value * discountPercentage.value / 100;
    sellingPrice.value = actualPrice.value - discount;
  }
});

sellingPrice.addEventListener('input', () => {
  let discount = (sellingPrice.value / actualPrice.value) * 100;
  discountPercentage.value = discount;
});


let uploadImages = document.querySelectorAll('.fileupload');
let imagePaths = [];
let imageUploadsInProgress = 0;

uploadImages.forEach((fileupload, index) => {
  fileupload.addEventListener('change', async () => {
    const file = fileupload.files[0];
    if (file && file.type.includes('image')) {
      imageUploadsInProgress++;
      try {
        const response = await fetch('/s3url');
        const url = await response.json();

        const uploadResponse = await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type
          }
        });

        if (uploadResponse.ok) {
          const imageUrl = url.split("?")[0];
          imagePaths[index] = imageUrl;

          let label = document.querySelector(`label[for=${fileupload.id}]`);
          label.style.backgroundImage = `url(${imageUrl})`;

          let productImage = document.querySelector('.product-image');
          productImage.style.backgroundImage = `url(${imageUrl})`;
        } else {
          console.error('Failed to upload image:', uploadResponse.statusText);
          showAlert('Image upload failed. Please try again.');
        }
      } catch (error) {
        console.error('Error occurred:', error);
        showAlert('Error uploading image.');
      } finally {
        imageUploadsInProgress--;
      }
    } else {
      showAlert('Please upload an image file.');
    }
  });
});


const productName = document.querySelector('#product-name');
const shortLine = document.querySelector('#short-des');
const des = document.querySelector('#des');
const stock = document.querySelector('#stock');
const tags = document.querySelector('#tags');
const loader = document.querySelector('.loader');

const addProductBtn = document.querySelector('#add-btn');
const saveDraft = document.querySelector('#save-btn');

const validateForm = () => {
  if (!productName.value.length) {
    return showAlert('Enter product name');
  } else if (shortLine.value.length > 500 || shortLine.value.length < 10) {
    return showAlert('Description should be in the range between 10 and 500 letters');
  } else if (!des.value.length) {
    return showAlert('Add description about the product');
  } else if (imagePaths.filter(Boolean).length === 0) {
    return showAlert('Upload at least one product image');
  } else if (!actualPrice.value.length || !discountPercentage.value.length || !sellingPrice.value.length) {
    return showAlert('The pricing must not be empty');
  } else if (stock.value < 20) {
    return showAlert('You must have at least 20 product items in stock');
  } else if (!tags.value.length) {
    return showAlert('Enter a few tags to help ranking your product in search');
  }
  return true;
};

const productData = () => {
  let tagArr = tags.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
  return {
    name: productName.value,
    shortDes: shortLine.value,
    des: des.value,
    images: imagePaths.filter(Boolean), // only valid uploaded images
    actualPrice: actualPrice.value,
    discount: discountPercentage.value,
    sellingPrice: sellingPrice.value,
    stock: stock.value,
    tags: tagArr,
    email: user.email
  };
};

// Wait until uploads are done before saving
const waitForUploads = async () => {
  while (imageUploadsInProgress > 0) {
    await new Promise(resolve => setTimeout(resolve, 200));
  }
};


addProductBtn.addEventListener('click', async () => {
  await waitForUploads(); // ensures all AWS uploads are complete
  if (validateForm()) {
    loader.style.display = 'block';
    let data = productData();
    if (productId) {
      data.id = productId;
    }
    sendData('/addProduct', data);
  }
});

saveDraft.addEventListener('click', async () => {
  await waitForUploads();
  if (!productName.value.length) {
    showAlert('Enter product name');
  } else {
    let data = productData();
    data.draft = true;
    if (productId) {
      data.id = productId;
    }
    sendData('/addProduct', data);
  }
});


const setFormsData = (data) => {
  productName.value = data.name;
  shortLine.value = data.shortDes;
  des.value = data.des;
  actualPrice.value = data.actualPrice;
  discountPercentage.value = data.discount;
  sellingPrice.value = data.sellingPrice;
  stock.value = data.stock;
  tags.value = data.tags ? data.tags.join(', ') : '';

  imagePaths = data.images || [];
  imagePaths.forEach((url, i) => {
    let label = document.querySelector(`label[for=${uploadImages[i].id}]`);
    label.style.backgroundImage = `url(${url})`;
    let productImage = document.querySelector('.product-image');
    productImage.style.backgroundImage = `url(${url})`;
  });
};

const fetchProductData = () => {
  fetch('/get-products', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ id: productId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.product) {
        setFormsData(data.product);
      } else {
        location.replace('/seller');
      }
    })
    .catch(err => {
      location.replace('/seller');
    });
};

let productId = null;
if (location.pathname !== '/addProduct') {
  productId = decodeURI(location.pathname.split('/').pop());
  fetchProductData();
}
