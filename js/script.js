let cartItemId = 1;

function loadCart() {
  const products = getProductsFromStorage();
  cartItemId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
  products.forEach((product) => addToCartList(product));
  updateCartInfo();
}

function purchaseProduct(e) {
  const productElement = e.target.parentElement.parentElement.parentElement;

  const productInfo = {
    id: cartItemId,
    name: productElement.querySelector('.product-title').innerText,
    image: productElement.querySelector('.image-showcase :first-child').src,
    price: parseInt(productElement.querySelector('.new-price').innerText.replace(/[. VND]/g, '')),
    quantity: parseInt(productElement.querySelector('.quantity-input').value),
  };
  cartItemId++;
  addToCartList(productInfo);
  saveProductInStorage(productInfo);
}

function addToCartList(productInfo) {
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');
  cartItem.setAttribute('data-id', productInfo.id);
  cartItem.innerHTML = `
    <img
      src="${productInfo.image}"
      alt="${productInfo.image}"
      class="cart-image"
    />
    <div class="cart-text">
      <a href="#" class="cart-name">${productInfo.name}</a>
      <p class="cart-price">
        Giá: ${productInfo.price.toLocaleString('it-IT', {
          style: 'currency',
          currency: 'VND',
        })}
      </p>
      <p class="cart-quantity">Số lượng: ${productInfo.quantity}</p>
    </div>
    <div class="cart-delete" onclick="deleteProductInCartDropdown(event)" >
      <i class="fas fa-times"></i>
    </div>
  `;

  document.querySelector('.cart-items').appendChild(cartItem);
}

function deleteProductInCartDropdown(event) {
  let cartItem;
  if (event.target.tagName === 'DIV') {
    cartItem = event.target.parentElement;
    cartItem.remove();
  } else if (event.target.tagName === 'I') {
    cartItem = event.target.parentElement.parentElement;
    cartItem.remove();
  }

  const products = getProductsFromStorage();
  const updatedProducts = products.filter(function (product) {
    return product.id !== parseInt(cartItem.dataset.id);
  });
  localStorage.setItem('products', JSON.stringify(updatedProducts));
  updateCartInfo();
}

function deleteAllProduct(event) {
  document.querySelector('.cart-items').innerHTML = '';
  localStorage.clear();
  updateCartInfo();
}

function saveProductInStorage(product) {
  const products = getProductsFromStorage();
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
  updateCartInfo();
}

function getProductsFromStorage() {
  return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
}

function updateCartInfo() {
  const products = getProductsFromStorage();
  const totalPrice = products.reduce(function (accumulator, currentValue) {
    return (accumulator += currentValue.price * currentValue.quantity);
  }, 0);

  document.querySelector('.cart-summary').innerHTML = `
    <span>Tổng cộng: </span> ${totalPrice.toLocaleString('it-IT', {
      style: 'currency',
      currency: 'VND',
    })}
  `;
  document.querySelector('.cart-count').innerHTML = products.length;
}

function changeQuantityValue(e, changeValue) {
  let groupInputElement =
    e.target.tagName === 'BUTTON' ? e.target.parentElement : e.target.parentElement.parentElement;
  const inputElement = groupInputElement.querySelector('.quantity-input');

  if (parseInt(inputElement.value) + changeValue > 0) {
    inputElement.value = parseInt(inputElement.value) + changeValue;
  }
}
