// Product Gallery Script
document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('galleryViewport');
  const track = document.getElementById('galleryTrack');
  const slides = Array.from(track.children);
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const thumbnailBtns = document.querySelectorAll('.thumbnail-btn');

  let currentIndex = 0;
  const totalSlides = slides.length;
  localStorage.removeItem('productSubtotalAfterDelivery')

  // Function to switch to a specific slide index
  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    currentIndex = index;
    const slideWidth = viewport.clientWidth;

    viewport.scrollTo({
      left: slideWidth * currentIndex,
      behavior: 'smooth'
    });

    updateThumbnails();
  }

  // Update active states on thumbnails
  function updateThumbnails() {
    thumbnailBtns.forEach((btn, idx) => {
      if (idx === currentIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Button Event Listeners
  nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
  });

  prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
  });

  // Thumbnail Click Events
  thumbnailBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'), 10);
      goToSlide(index);
    });
  });

  // Prevent free-form multi-image scrolling on track pads/wheels (Forces single-image step)
  let isScrolling = false;
  viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isScrolling) return;

    if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 20) {
      isScrolling = true;
      if (e.deltaX > 0 || e.deltaY > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
      setTimeout(() => {
        isScrolling = false;
      }, 400); // Cooldown to match transition speed
    }
  }, { passive: false });

  // Sync index on manual touch swipes / user scroll interactions
  let scrollTimeout;
  viewport.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const slideWidth = viewport.clientWidth;
      const computedIndex = Math.round(viewport.scrollLeft / slideWidth);
      if (computedIndex !== currentIndex) {
        currentIndex = computedIndex;
        updateThumbnails();
      }
    }, 50);
  });

  // Recalculate layout on window resize
  window.addEventListener('resize', () => {
    viewport.scrollTo({
      left: viewport.clientWidth * currentIndex,
      behavior: 'auto'
    });
  });

  // Logic

  localStorage.setItem('isProductPageVisited', 'true');
  // localStorage.setItem('AddToCartClicked', 'false');

});

// Short FAQ
const faqHeaders = document.querySelectorAll(".faq-header");

faqHeaders.forEach(header => {
  header.addEventListener("click", () => {
    const item = header.parentElement;

    // Toggle current item
    item.classList.toggle("active");
  });
});

// Cart Code

const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartMessage = document.getElementById('cart-message');
const totalPriceElement = document.querySelector('.total-price');
const checkoutButton = document.querySelector('.checkout-btn');
const cartCount = document.getElementById("cart-number");
let cartItemQty = document.getElementById("cart-item-qty");
// Open Cart
function openCart() {
  let bool = localStorage.getItem('AddToCartClicked');
  if (bool === 'false' || bool === null) {
    // Show message Your Cart is Empty
    removeCartItemIfNotAddToCart();
    cartMessage.style.display = 'block';
    totalPriceElement.textContent = 'Rs 0.00'; // Hide total price
    checkoutButton.style.display = 'none'; // Hide checkout button
    cartCount.textContent = "0";
  } else {
    const cartItem = document.querySelector('.cart-item');
    cartItem.style.display = 'flex'; // Show cart items
    cartMessage.style.display = 'none';
    // totalPriceElement.textContent = 'Rs 1,499.00';
    totalPriceElement.textContent = `Rs ${Number(localStorage.getItem('productSubtotal') || 0).toLocaleString('en-US')}`;
    cartItemQty.textContent = 'Qty: '+localStorage.getItem('productQuantity') || '2';
    checkoutButton.style.display = 'block';
    cartCount.textContent = "1";

  }
  cartDrawer.classList.add('active');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling

}

if(localStorage.getItem('AddToCartClicked') == 'false' || localStorage.getItem('AddToCartClicked') == null ){
  cartCount.textContent = "0";
}else{
  cartCount.textContent = "1";
}

// Close Cart
function closeCart() {
  cartDrawer.classList.remove('active');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = 'auto'; // Restore background scrolling
}

 let productSubtotall = Number(localStorage.getItem('productSubtotal'));

cartToggle.addEventListener('click', () => {
  fbq('track', 'AddToCart', {
    content_name: 'Refrigerator Lock',
    content_type: 'product',
    value: Number(localStorage.getItem('productSubtotal')) || 799,
    currency: 'PKR'
});
  localStorage.setItem('AddToCartClicked', 'true');
  if(localStorage.getItem('AddToCartClicked') == 'false'){
  cartCount.textContent = "0";
}else{
  cartCount.textContent = "1";
}
  openCart();
});
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Optional: Close cart on 'Escape' key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCart();
  }
});
function removeCartItem(button) {
  const cartItem = button.closest('.cart-item');
  cartItem.style.display = 'none';
  localStorage.setItem('AddToCartClicked', 'false');
  totalPriceElement.textContent = 'Rs 0.00';
  checkoutButton.style.display = 'none';
  if(localStorage.getItem('AddToCartClicked') == 'false'){
  cartCount.textContent = "0";
}else{
  cartCount.textContent = "1";
}
}
function removeCartItemIfNotAddToCart() {
  const cartItems = document.querySelectorAll('.cart-item');
  cartItems.forEach(item => item.style.display = 'none');
  totalPriceElement.textContent = 'Rs 0.00';
  checkoutButton.style.display = 'none';
}

// FAQ Logic

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const faqItem = button.parentElement;

    faqItem.classList.toggle("active");
  });
});

const QUANTITY_KEY = 'productQuantity';
const SUBTOTAL_KEY = 'productSubtotal';

const BUNDLE_PRICES = {
  1: 799,
  2: 1199,
  3: 1999
};

function getBundlePrice(quantity) {
  return BUNDLE_PRICES[quantity];
}

function getStoredQuantity() {
  const qty = parseInt(localStorage.getItem(QUANTITY_KEY), 10);
  const subtotal = Number(localStorage.getItem(SUBTOTAL_KEY));
  return getBundlePrice(qty) === subtotal ? qty : 2;
}

function getProductQuantityInput() {
  return document.getElementById('product-quantity');
}

function getCartQuantitySpan() {
  return document.querySelector('.cart-item-quantity span');
}

function updateQuantityUI(quantity) {
  const productQuantityInput = getProductQuantityInput();
  const cartQuantitySpan = getCartQuantitySpan();

  if (productQuantityInput) {
    productQuantityInput.value = quantity;
  }

  if (cartQuantitySpan) {
    cartQuantitySpan.textContent = String(quantity);
  }
}

function updateSubtotal(quantity) {
  const subtotal = getBundlePrice(quantity) || BUNDLE_PRICES[2];
  localStorage.setItem(SUBTOTAL_KEY, String(subtotal));

  if (totalPriceElement) {
    totalPriceElement.textContent = `Rs ${subtotal.toLocaleString('en-US')}`;
  }
}

function setQuantity(quantity) {
  const safeQty = BUNDLE_PRICES[quantity] ? quantity : 2;
  localStorage.setItem(QUANTITY_KEY, String(safeQty));
  updateQuantityUI(safeQty);
  updateSubtotal(safeQty);
  updateSelectedBundle(safeQty);
}

function changeQuantity(delta) {
  const nextQty = getStoredQuantity() + delta;
  setQuantity(nextQty);
}

function initQuantityState() {
  const qty = getStoredQuantity();
  localStorage.setItem(QUANTITY_KEY, String(qty));
  updateQuantityUI(qty);
  updateSubtotal(qty);
  updateSelectedBundle(qty);
}

function updateSelectedBundle(quantity) {
  document.querySelectorAll('.bundle-card').forEach((card) => {
    const isSelected = Number(card.dataset.quantity) === quantity;
    card.classList.toggle('active', isSelected);

    const radio = card.querySelector('.bundle-radio');
    if (radio) {
      radio.checked = isSelected;
    }
  });

  updateMobileBuyBar(quantity);
}

function updateMobileBuyBar(quantity) {
  const quantityElement = document.getElementById('mobileBuyQuantity');
  const priceElement = document.getElementById('mobileBuyPrice');
  const price = getBundlePrice(quantity);

  if (!quantityElement || !priceElement || !price) {
    return;
  }

  quantityElement.textContent = `${quantity} ${quantity === 1 ? 'Piece' : 'Pieces'}`;
  priceElement.textContent = `Rs ${price.toLocaleString('en-US')}`;
}

document.querySelectorAll('.bundle-card').forEach((card) => {
  card.addEventListener('click', () => {
    const quantity = Number(card.dataset.quantity);
    if (BUNDLE_PRICES[quantity]) {
      setQuantity(quantity);
    }
  });
});

const subtotal = Number(localStorage.getItem('productSubtotal') || 0);
document.querySelector('.total-price').textContent =
  `Rs ${subtotal.toLocaleString('en-US')}`;
  // document.getElementById('selected-color').innerText = "Green";
  const phoneNumber = "923148304327"; // Replace with your phone number (include country code, no + or spaces)
    const productName = "Refrigerator Lock"; // Dynamic product title
    const productPrice = "Rs 799"; // Dynamic product price
    
    // Construct pre-written message
    const rawMessage = `Hello! I have a question about ${productName} (${productPrice}). Can you please assist me?`;
    
    // URL-encode message to handle spaces and special characters safely
    const encodedMessage = encodeURIComponent(rawMessage);

    // Set the href attribute using WhatsApp Web / App universal link
    const whatsappAnchor = document.getElementById("whatsapp-link");
    whatsappAnchor.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    localStorage.setItem('productQuantity', '2');
    localStorage.setItem('productSubtotal', '1199');
    updateMobileBuyBar(2);

    
