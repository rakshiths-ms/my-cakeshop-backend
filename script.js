



// ===== Cake Data =====
const cakes = [
  {
    id: 1,
    name: "Classic Vanilla Dream",
    category: "Classic",
    price: 35,
    description: "A timeless vanilla sponge layered with silky buttercream frosting and topped with fresh seasonal berries. Light, fluffy, and absolutely heavenly.",
    emoji: "🎂",
    popular: true,
    sizes: ['6"', '8"', '10"'],
    flavors: ["Vanilla Bean", "French Vanilla", "Madagascar Vanilla"],
    sizeMultipliers: [1, 1.4, 1.8],
  },
  {
    id: 2,
    name: "Chocolate Indulgence",
    category: "Classic",
    price: 40,
    description: "Rich dark chocolate layers with velvety ganache filling, finished with a stunning mirror glaze. A true chocolate lover's paradise.",
    emoji: "🍫",
    popular: true,
    sizes: ['6"', '8"', '10"'],
    flavors: ["Dark Chocolate", "Milk Chocolate", "Belgian Chocolate"],
    sizeMultipliers: [1, 1.4, 1.8],
  },
  {
    id: 3,
    name: "Red Velvet Elegance",
    category: "Classic",
    price: 45,
    description: "Stunning red velvet sponge with luxurious cream cheese frosting. A show-stopping cake with a hint of cocoa and a velvety texture.",
    emoji: "❤️",
    popular: false,
    sizes: ['6"', '8"', '10"'],
    flavors: ["Classic Red Velvet", "Blue Velvet", "Pink Velvet"],
    sizeMultipliers: [1, 1.4, 1.8],
  },
  {
    id: 4,
    name: "Strawberry Bliss",
    category: "Fruit",
    price: 42,
    description: "Fresh strawberry sponge layered with homemade strawberry compote and light whipped cream. Bursting with natural berry sweetness.",
    emoji: "🍓",
    popular: true,
    sizes: ['6"', '8"', '10"'],
    flavors: ["Strawberry", "Strawberry Lemon", "Strawberry Vanilla"],
    sizeMultipliers: [1, 1.4, 1.8],
  },
  {
    id: 5,
    name: "Lemon Sunshine",
    category: "Fruit",
    price: 38,
    description: "Zesty lemon cake with tangy lemon curd filling and a cloud of toasted meringue. Bright, refreshing, and irresistible.",
    emoji: "🍋",
    popular: false,
    sizes: ['6"', '8"', '10"'],
    flavors: ["Lemon", "Lemon Blueberry", "Lemon Lavender"],
    sizeMultipliers: [1, 1.4, 1.8],
  },
  {
    id: 6,
    name: "Caramel Walnut Delight",
    category: "Specialty",
    price: 48,
    description: "Rich caramel cake studded with toasted walnuts and drizzled with salted caramel sauce. A perfect balance of sweet and nutty.",
    emoji: "🥜",
    popular: false,
    sizes: ['6"', '8"', '10"'],
    flavors: ["Salted Caramel", "Caramel Pecan", "Caramel Toffee"],
    sizeMultipliers: [1, 1.4, 1.8],
  },
  {
    id: 7,
    name: "Tiramisu Tower",
    category: "Specialty",
    price: 50,
    description: "Coffee-soaked layers with heavenly mascarpone cream, dusted with premium cocoa. An Italian classic reimagined as a stunning cake.",
    emoji: "☕",
    popular: true,
    sizes: ['6"', '8"', '10"'],
    flavors: ["Classic Tiramisu", "Chocolate Tiramisu", "Matcha Tiramisu"],
    sizeMultipliers: [1, 1.4, 1.8],
  },
  {
    id: 8,
    name: "Wedding White Rose",
    category: "Wedding",
    price: 120,
    description: "An exquisite three-tier elegant white cake adorned with handcrafted sugar roses. Perfect for making your special day even more magical.",
    emoji: "🌹",
    popular: false,
    sizes: ["3-Tier", "4-Tier", "5-Tier"],
    flavors: ["Vanilla & Rose", "Lemon & Elderflower", "Champagne"],
    sizeMultipliers: [1, 1.4, 1.8],
  },
];

const categories = ["All", "Classic", "Fruit", "Specialty", "Wedding"];

// ===== State =====
let cart = JSON.parse(localStorage.getItem("sweetLayersCart")) || [];
let currentPage = "home";
let previousPage = "home";
let activeCategory = "All";
let searchTerm = "";

// ===== Cart Helpers =====
function saveCart() {
  localStorage.setItem("sweetLayersCart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = total;
  badge.classList.toggle("empty", total === 0);
}

function addToCart(cakeId, size, flavor, message, quantity) {
  const cake = cakes.find((c) => c.id === cakeId);
  if (!cake) return;

  const sizeIdx = cake.sizes.indexOf(size);
  const multiplier = cake.sizeMultipliers[sizeIdx] || 1;
  const unitPrice = +(cake.price * multiplier).toFixed(2);

  // Check for existing identical item
  const existing = cart.find(
    (item) => item.cakeId === cakeId && item.size === size && item.flavor === flavor
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: Date.now(),
      cakeId,
      name: cake.name,
      emoji: cake.emoji,
      category: cake.category,
      size,
      flavor,
      message: message || "",
      quantity,
      unitPrice,
    });
  }

  saveCart();
}

function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  saveCart();
  renderCart();
}

function updateQuantity(itemId, delta) {
  const item = cart.find((i) => i.id === itemId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(itemId);
    return;
  }
  saveCart();
  renderCart();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function clearCart() {
  cart = [];
  saveCart();
}

// ===== Navigation =====
function navigate(page, data) {
  previousPage = currentPage;
  currentPage = page;

  // Hide all pages
  document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));

  // Show target page
  const target = document.getElementById("page-" + page);
  if (target) {
    target.style.display = "block";
    // Re-trigger animation
    target.style.animation = "none";
    target.offsetHeight; // force reflow
    target.style.animation = "fadeIn 0.3s ease";
  }

  // Update nav active state
  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.classList.toggle("active", a.dataset.page === page);
  });

  // Close mobile menu
  document.getElementById("navLinks").classList.remove("open");

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Render page-specific content
  switch (page) {
    case "home":
      renderFeatured();
      break;
    case "menu":
      renderMenu();
      break;
    case "detail":
      renderDetail(data);
      break;
    case "cart":
      renderCart();
      break;
    case "checkout":
      renderCheckout();
      break;
  }
}

function goBack() {
  navigate(previousPage || "menu");
}

function toggleMobileMenu() {
  document.getElementById("navLinks").classList.toggle("open");
}

// ===== Render: Cake Card =====
function createCakeCard(cake) {
  const card = document.createElement("div");
  card.className = "cake-card";
  card.onclick = () => navigate("detail", cake.id);
  card.innerHTML = `
    <div class="cake-card-image">
      <span class="cake-emoji">${cake.emoji}</span>
      ${cake.popular ? '<span class="popular-badge">Popular</span>' : ""}
    </div>
    <div class="cake-card-body">
      <div class="cake-card-category">${cake.category}</div>
      <h3 class="cake-card-name">${cake.name}</h3>
      <p class="cake-card-desc">${cake.description}</p>
      <div class="cake-card-footer">
        <span class="cake-card-price">$${cake.price}</span>
        <button class="cake-card-btn" onclick="event.stopPropagation(); navigate('detail', ${cake.id})">View Details</button>
      </div>
    </div>
  `;
  return card;
}

// ===== Render: Home (Featured) =====
function renderFeatured() {
  const grid = document.getElementById("featuredCakes");
  grid.innerHTML = "";
  cakes
    .filter((c) => c.popular)
    .forEach((cake) => grid.appendChild(createCakeCard(cake)));
}

// ===== Render: Menu =====
function renderCategoryFilters() {
  const container = document.getElementById("categoryFilters");
  container.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (cat === activeCategory ? " active" : "");
    btn.textContent = cat;
    btn.onclick = () => {
      activeCategory = cat;
      renderMenu();
    };
    container.appendChild(btn);
  });
}

function filterCakes() {
  searchTerm = document.getElementById("searchInput").value.toLowerCase();
  renderMenu();
}

function renderMenu() {
  renderCategoryFilters();

  const grid = document.getElementById("menuCakes");
  const noResults = document.getElementById("noResults");
  grid.innerHTML = "";

  let filtered = cakes;

  if (activeCategory !== "All") {
    filtered = filtered.filter((c) => c.category === activeCategory);
  }

  if (searchTerm) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm) ||
        c.description.toLowerCase().includes(searchTerm)
    );
  }

  if (filtered.length === 0) {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
    filtered.forEach((cake) => grid.appendChild(createCakeCard(cake)));
  }
}

// ===== Render: Detail =====
function renderDetail(cakeId) {
  const cake = cakes.find((c) => c.id === cakeId);
  if (!cake) return;

  const container = document.getElementById("cakeDetail");

  let selectedSize = cake.sizes[0];
  let selectedFlavor = cake.flavors[0];
  let customMessage = "";
  let quantity = 1;

  function getPrice() {
    const idx = cake.sizes.indexOf(selectedSize);
    return +(cake.price * cake.sizeMultipliers[idx]).toFixed(2);
  }

  function render() {
    container.innerHTML = `
      <div class="detail-image">
        <span class="cake-emoji">${cake.emoji}</span>
      </div>
      <div class="detail-info">
        <div class="detail-category">${cake.category}</div>
        <h1>${cake.name}</h1>
        <p class="detail-description">${cake.description}</p>
        <div class="detail-price">$${getPrice().toFixed(2)}</div>

        <div class="option-group">
          <div class="option-label">Size</div>
          <div class="option-buttons" id="sizeOptions">
            ${cake.sizes
              .map(
                (s) =>
                  `<button class="option-btn${s === selectedSize ? " selected" : ""}" data-size="${s}">${s}</button>`
              )
              .join("")}
          </div>
        </div>

        <div class="option-group">
          <div class="option-label">Flavor</div>
          <div class="option-buttons" id="flavorOptions">
            ${cake.flavors
              .map(
                (f) =>
                  `<button class="option-btn${f === selectedFlavor ? " selected" : ""}" data-flavor="${f}">${f}</button>`
              )
              .join("")}
          </div>
        </div>

        <div class="option-group">
          <div class="option-label">Custom Message (optional)</div>
          <input type="text" class="custom-message-input" id="customMessage" 
            placeholder="e.g. Happy Birthday, Sarah!" maxlength="50" 
            value="${customMessage}" />
          <div class="char-count"><span id="charCount">${customMessage.length}</span>/50</div>
        </div>

        <div class="option-group">
          <div class="option-label">Quantity</div>
          <div class="quantity-control">
            <button class="qty-btn" id="qtyMinus">-</button>
            <span class="qty-value" id="qtyValue">${quantity}</span>
            <button class="qty-btn" id="qtyPlus">+</button>
          </div>
        </div>

        <div class="add-to-cart-section">
          <button class="btn btn-primary btn-lg" id="addToCartBtn">
            Add to Cart - $${(getPrice() * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    `;

    // Event listeners
    container.querySelectorAll("#sizeOptions .option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedSize = btn.dataset.size;
        render();
      });
    });

    container.querySelectorAll("#flavorOptions .option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedFlavor = btn.dataset.flavor;
        render();
      });
    });

    const msgInput = container.querySelector("#customMessage");
    msgInput.addEventListener("input", () => {
      customMessage = msgInput.value;
      container.querySelector("#charCount").textContent = customMessage.length;
    });

    container.querySelector("#qtyMinus").addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        render();
      }
    });

    container.querySelector("#qtyPlus").addEventListener("click", () => {
      quantity++;
      render();
    });

    container.querySelector("#addToCartBtn").addEventListener("click", function () {
      addToCart(cake.id, selectedSize, selectedFlavor, customMessage, quantity);
      this.textContent = "Added!";
      this.classList.add("btn-added");
      setTimeout(() => {
        this.textContent = `Add to Cart - $${(getPrice() * quantity).toFixed(2)}`;
        this.classList.remove("btn-added");
      }, 1500);
    });
  }

  render();
}

document.getElementById("loginForm").addEventListener("submit", function(e){

e.preventDefault();

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

fetch("http://localhost:8080/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username:username,
password:password
})

})

.then(response => response.json())

.then(data => {

if(data.message === "Login Successful"){

navigate("menu");

}else{

document.getElementById("loginMessage").innerText = "Invalid login";

}

});

});

// ===== Render: Cart =====
function renderCart() {
  const container = document.getElementById("cartContent");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any cakes yet. Browse our menu to find something sweet!</p>
        <button class="btn btn-primary" onclick="navigate('menu')">Browse Menu</button>
      </div>
    `;
    return;
  }

  const itemsHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <div class="cart-item-image">
        <span class="cake-emoji">${item.emoji}</span>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-details">
          ${item.size} &middot; ${item.flavor}${item.message ? ' &middot; "' + escapeHtml(item.message) + '"' : ""}
        </div>
        <div class="cart-item-bottom">
          <span class="cart-item-price">$${(item.unitPrice * item.quantity).toFixed(2)}</span>
          <div class="cart-item-actions">
            <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  const subtotal = getCartTotal();
  const delivery = 0;
  const total = subtotal + delivery;

  container.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items">${itemsHTML}</div>
      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal (${getCartItemCount()} items)</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Delivery</span>
          <span>Free</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span class="total-price">$${total.toFixed(2)}</span>
        </div>
        <button class="btn btn-primary" onclick="navigate('checkout')">Proceed to Checkout</button>
      </div>
    </div>
  `;
}

// ===== Render: Checkout =====
function renderCheckout() {
  if (cart.length === 0) {
    navigate("cart");
    return;
  }

  const container = document.getElementById("checkoutContent");
  const subtotal = getCartTotal();

  const itemsHTML = cart
    .map(
      (item) => `
    <div class="checkout-item">
      <span class="checkout-item-name">${item.emoji} ${item.name} (${item.size})</span>
      <span class="checkout-item-qty">x${item.quantity}</span>
      <span class="checkout-item-price">$${(item.unitPrice * item.quantity).toFixed(2)}</span>
    </div>
  `
    )
    .join("");

  container.innerHTML = `
    <form class="checkout-form" id="checkoutForm" onsubmit="handleCheckout(event)">
      <div class="form-section">
        <h3>Contact Information</h3>
        <div class="form-grid">
          <div class="form-group">
            <label for="firstName">First Name *</label>
            <input type="text" id="firstName" required placeholder="John" />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name *</label>
            <input type="text" id="lastName" required placeholder="Doe" />
          </div>
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" required placeholder="john@example.com" />
          </div>
          <div class="form-group">
            <label for="phone">Phone *</label>
            <input type="tel" id="phone" required placeholder="(555) 123-4567" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Delivery Details</h3>
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="address">Address *</label>
            <input type="text" id="address" required placeholder="123 Baker Street" />
          </div>
          <div class="form-group">
            <label for="city">City *</label>
            <input type="text" id="city" required placeholder="Caketown" />
          </div>
          <div class="form-group">
            <label for="zipCode">Zip Code *</label>
            <input type="text" id="zipCode" required placeholder="12345" />
          </div>
          <div class="form-group">
            <label for="deliveryDate">Preferred Date *</label>
            <input type="date" id="deliveryDate" required />
          </div>
          <div class="form-group">
            <label for="deliveryTime">Preferred Time</label>
            <select id="deliveryTime">
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon" selected>Afternoon (12 PM - 5 PM)</option>
              <option value="evening">Evening (5 PM - 8 PM)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Special Notes</h3>
        <div class="form-grid">
          <div class="form-group full-width">
            <label for="notes">Allergies, special instructions, etc.</label>
            <textarea id="notes" placeholder="Any special instructions for your order..."></textarea>
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-lg" style="width:100%;">Place Order - $${subtotal.toFixed(2)}</button>
    </form>

    <div class="checkout-summary">
      <h3>Order Summary</h3>
      ${itemsHTML}
      <div class="summary-row" style="margin-top:1rem;">
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Delivery</span>
        <span>Free</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span class="total-price">$${subtotal.toFixed(2)}</span>
      </div>
    </div>
  `;

  // Set minimum date to today
  const dateInput = document.getElementById("deliveryDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }
}

function handleCheckout(e) {
  e.preventDefault();

  // Generate order ID
  const orderId = "SL-" + Date.now().toString(36).toUpperCase();
  document.getElementById("orderId").textContent = "Order ID: " + orderId;

  clearCart();
  navigate("success");
}



// ===== Utility: Escape HTML =====
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ===== Init =====
function init() {
  updateCartBadge();
  renderFeatured();
  renderCategoryFilters();
}

// Start the app
document.addEventListener("DOMContentLoaded", init);
