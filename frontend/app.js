const state = {
  products: [],
  cart: [],
  category: "All",
  query: "",
  sort: "featured",
  activeProduct: null
};

const IMAGE_BASE = "https://lumen-co-full-stack-e-commerce-website.onrender.com";

const els = {
  grid: document.getElementById("grid"),
  filters: document.getElementById("filters"),
  search: document.getElementById("search"),
  sort: document.getElementById("sort"),
  status: document.getElementById("status"),
  cartCount: document.getElementById("cartCount"),
  cartItems: document.getElementById("cartItems"),
  cartTotal: document.getElementById("cartTotal"),
  drawer: document.getElementById("drawer"),
  overlay: document.getElementById("overlay"),
  modal: document.getElementById("modal"),
  toast: document.getElementById("toast"),
  statCount: document.getElementById("statCount"),
  statCats: document.getElementById("statCats")
};

const money = (n) => "₦" + Number(n).toLocaleString();
function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function openCart() {
  els.drawer.classList.add("open");
  els.overlay.classList.add("show");
}

function closeCart() {
  els.drawer.classList.remove("open");
  if (!els.modal.classList.contains("show")) els.overlay.classList.remove("show");
}

function openModal(id) {
  const product = state.products.find((item) => item._id === id);
  if (!product) return;
  state.activeProduct = product;
  document.getElementById("modalPhoto").style.backgroundImage =
  "url('" + IMAGE_BASE + product.image + "')";

  document.getElementById("modalCat").textContent = product.category;
  document.getElementById("modalName").textContent = product.name;
  document.getElementById("modalDesc").textContent = product.description;
  document.getElementById("modalPrice").textContent = money(product.price);
  els.modal.classList.add("show");
  els.overlay.classList.add("show");
}

function closeModal() {
  els.modal.classList.remove("show");
  if (!els.drawer.classList.contains("open")) els.overlay.classList.remove("show");
}

function addToCart(id) {
  const line = state.cart.find((item) => item.id === id);
  if (line) line.qty += 1;
  else state.cart.push({ id, qty: 1 });
  renderCart();
  toast("Added to bag");
}

function changeQty(id, delta) {
  const line = state.cart.find((item) => item.id === id);
  if (!line) return;
  line.qty += delta;
  state.cart = state.cart.filter((item) => item.qty > 0);
  renderCart();
}

function visibleProducts() {
  const query = state.query.trim().toLowerCase();
  let list = state.products.filter((product) => {
    const inCategory = state.category === "All" || product.category === state.category;
    const inSearch = product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
    return inCategory && inSearch;
  });
  if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (state.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function renderFilters() {
  const categories = ["All", ...new Set(state.products.map((product) => product.category))];
  els.filters.innerHTML = categories.map((category) => {
    const active = category === state.category ? " active" : "";
    return '<button class="chip' + active + '" type="button" data-cat="' + category + '">' + category + "</button>";
  }).join("");
  els.statCats.textContent = String(Math.max(categories.length - 1, 0));
}

function renderProducts() {
  const list = visibleProducts();
  if (!list.length) {
    els.grid.innerHTML = '<p class="empty">No products match that search.</p>';
    return;
  }
  els.grid.innerHTML = list.map((product) => `
    <article class="card">
      <div class="thumb" style="background-image:url('${IMAGE_BASE}${product.image}')" data-open="${product._id}">
        <span class="tag">${product.tag || "Shop"}</span>
      </div>
      <div class="card-body">
        <div class="cat">${product.category}</div>
        <h3>${product.name}</h3>
        <div class="price-row">
          <div class="price">${money(product.price)}</div>
          <button class="add" type="button" data-add="${product._id}">Add</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCart() {
  const count = state.cart.reduce((sum, line) => sum + line.qty, 0);
  const total = state.cart.reduce((sum, line) => {
    const product = state.products.find((item) => item._id === line.id);
    return sum + (product ? product.price * line.qty : 0);
  }, 0);
  els.cartCount.textContent = String(count);
  els.cartTotal.textContent = money(total); 
  if (!state.cart.length) {
    els.cartItems.innerHTML = '<p class="empty">Your bag is empty. Add something calm and useful.</p>';
    return;
  }
  els.cartItems.innerHTML = state.cart.map((line) => {
   const product = state.products.find((item) => item._id === line.id);
    if (!product) return "";
    return `
      <div class="cart-row">
        <img src="${IMAGE_BASE}${product.image}" alt="" />
        <div>
          <strong>${product.name}</strong>
          <div class="qty">
            <button type="button" data-dec="${product._id}">−</button>
            <span>${line.qty}</span>
            <button type="button" data-inc="${product._id}">+</button>
          </div>
        </div>
        <div>${money(product.price * line.qty)}</div>
      </div>
    `;
  }).join("");
}

function bindEvents() {
  els.filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cat]");
    if (!button) return;
    state.category = button.dataset.cat;
    renderFilters();
    renderProducts();
  });

  els.search.addEventListener("input", () => {
    state.query = els.search.value;
    renderProducts();
  });

  els.sort.addEventListener("change", () => {
    state.sort = els.sort.value;
    renderProducts();
  });

  els.grid.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add]");
const open = event.target.closest("[data-open]");

if (add) addToCart(add.dataset.add);
else if (open) openModal(open.dataset.open);
  });

  els.cartItems.addEventListener("click", (event) => {
    const inc = event.target.closest("[data-inc]");
    const dec = event.target.closest("[data-dec]");
    if (inc) changeQty(inc.dataset.inc, 1);
if (dec) changeQty(dec.dataset.dec, -1);
  });

  document.getElementById("openCart").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("closeModal").addEventListener("click", closeModal);
  document.getElementById("modalAdd").addEventListener("click", () => {
    if (!state.activeProduct) return;
    addToCart(state.activeProduct.id);
    closeModal();
    openCart();
  });
  els.overlay.addEventListener("click", () => {
    closeModal();
    closeCart();
  });

 document.getElementById("checkout").addEventListener("click", async () => {
  if (!state.cart.length) {
    toast("Your bag is empty");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !phone || !address) {
    toast("Please fill in all your details");
    return;
  }

  const order = {
    customerName: name,
    phone: phone,
    address: address,

    items: state.cart.map((line) => ({
      productId: line.id,
      qty: line.qty
    })),

    total: state.cart.reduce((sum, line) => {
      const product = state.products.find((item) => item._id === line.id);
      return sum + (product ? product.price * line.qty : 0);
    }, 0)
  };

  // keep the rest of your existing code here
    const result = await api.placeOrder(order);
    state.cart = [];
    renderCart();

    document.getElementById("customerName").value = "";
document.getElementById("customerPhone").value = "";
document.getElementById("customerAddress").value = "";

    closeCart();
   toast(
  result.success
    ? "Order placed! ID: " + result.order._id
    : "Order could not be placed"
);

  });
}

async function init() {
  els.status.hidden = false;
  els.status.textContent = "Loading products...";
  try {
    state.products = await api.getProducts();
    els.statCount.textContent = String(state.products.length);
    els.status.hidden = true;
    renderFilters();
    renderProducts();
    renderCart();
    bindEvents();
  } catch (error) {
    els.status.hidden = false;
    els.status.textContent = "Could not load products.";
  }
}

document.getElementById("newsletter-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.target;
  const input = form.querySelector("input");
  const email = input.value.trim();


  try {
    console.log("Sending newsletter:", email);
    const response = await fetch(`${IMAGE_BASE}/api/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (data.success) {
      input.value = "";
      toast("You're subscribed!");
    } else {
      toast(data.message);
    }
  } catch (error) {
    console.error(error);
    toast("Could not subscribe");

  }
  document.getElementById("newsletter-form").reset();
});

init();
