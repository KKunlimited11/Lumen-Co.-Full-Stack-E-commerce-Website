const form = document.getElementById("productForm");
const message = document.getElementById("message");
const productList = document.getElementById("productList");

const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const categoryMessage = document.getElementById("categoryMessage");


let editingProductId = null;


form.addEventListener("submit", async (event) => {
    event.preventDefault();

   const formData = new FormData();

formData.append("name", document.getElementById("name").value);
formData.append("category", document.getElementById("category").value);
formData.append("price", document.getElementById("price").value);
formData.append("tag", document.getElementById("tag").value);
formData.append("description", document.getElementById("description").value);
const imageFile = document.getElementById("image").files[0];

if (imageFile) {
    formData.append("image", imageFile);
}

console.log(document.getElementById("image").files[0]);

const url = editingProductId
    ? `/api/products/${editingProductId}`
    : "/api/products";

const method = editingProductId ? "PUT" : "POST";

const response = await fetch(url, {
    method: method,
    body: formData
});
    const data = await response.json();

    if (data.success) {
        message.textContent = "Product added successfully!";
        form.reset();
    } else {
        message.textContent = data.message;
    }

   await loadProducts();
});



async function loadProducts() {
    const response = await fetch("/api/products");
    const data = await response.json();

    productList.innerHTML = data.products.map(product => `
    <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.category}</p>
        <p>₦${product.price}</p>
        <p>${product.tag || "No tag"}</p>
<p>${product.description}</p>

<button class="edit-product" data-id="${product._id}">
    Edit
</button>

<button class="delete-product" data-id="${product._id}">
    Delete
</button>
    </div>
`).join("");

}


async function deleteProduct(id) {
    const response = await fetch(`/api/products/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    if (data.success) {
        loadProducts();
    } else {
        alert(data.message);
    }
}


productList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-product")) {
        const id = event.target.dataset.id;

        deleteProduct(id);
    }
});



categoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: categoryName.value
        })
    });

    const data = await response.json();

    if (data.success) {
        categoryMessage.textContent = "Category added successfully!";
        categoryForm.reset();
    } else {
        categoryMessage.textContent = data.message;
    }
});


async function loadCategories() {
    const response = await fetch("/api/categories");
    const data = await response.json();

   const categoryList = document.getElementById("categoryList");

categoryList.innerHTML = data.categories.map(category => `
   <div class="category-item">
    <span>${category.name}</span>

    <button class="delete-category" data-id="${category._id}">
        Delete
    </button>
</div>
`).join("");

}

async function deleteCategory(id) {
    const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    if (data.success) {
        loadCategories();
    } else {
        alert(data.message);
    }
}

categoryList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-category")) {
        const id = event.target.dataset.id;

        deleteCategory(id);
    }
});

productList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("edit-product")) {
        const id = event.target.dataset.id;

        const response = await fetch("/api/products");
        const data = await response.json();

        const product = data.products.find(product => product._id === id);

        if (!product) return;

        editingProductId = id;

        document.getElementById("name").value = product.name;
        document.getElementById("category").value = product.category;
        document.getElementById("price").value = product.price;
        document.getElementById("tag").value = product.tag || "";
        document.getElementById("description").value = product.description;

        document.querySelector("#productForm button").textContent = "Update Product";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    await loadProducts()
});


async function loadOrders() {
  const response = await fetch("https://lumen-co-full-stack-e-commerce-website.onrender.com/api/orders");
  const data = await response.json();

  const ordersList = document.getElementById("ordersList");

  if (!data.success || !data.orders.length) {
    ordersList.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  ordersList.innerHTML = data.orders.map((order) => `
    <div class="order-card">
     <h3>Order #${order._id.slice(-6)}</h3>

      <p class="order-date">
  ${new Date(order.createdAt).toLocaleString()}
</p>
<p><strong>Status:</strong> ${order.status}</p>

<select class="order-status" data-order-id="${order._id}">
  <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
  <option value="Processing" ${order.status === "Processing" ? "selected" : ""}>Processing</option>
  <option value="Completed" ${order.status === "Completed" ? "selected" : ""}>Completed</option>
  <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
</select>

      <p><strong>Name:</strong> ${order.customerName}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
     <p><strong>Address:</strong> ${order.address}</p>

<div class="order-items">
  ${order.items.map((item) => `
    <p>
      ${item.productName} × ${item.qty}
      — ₦${item.price.toLocaleString()}
    </p>
  `).join("")}
</div>

<p><strong>Total:</strong> ₦${order.total.toLocaleString()}</p>

<button class="delete-order" data-order-id="${order._id}" type="button">
  Delete order
</button>

    </div>
  `).join("");
}




document.getElementById("ordersList").addEventListener("change", async (event) => {
  if (!event.target.classList.contains("order-status")) return;

  const orderId = event.target.dataset.orderId;
  const status = event.target.value;

  const response = await fetch(
    "https://lumen-co-full-stack-e-commerce-website.onrender.com/api/orders/" + orderId + "/status",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    }
  );

  const data = await response.json();

  if (data.success) {
    loadOrders();
  }
});

document.getElementById("ordersList").addEventListener("click", async (event) => {
  const button = event.target.closest(".delete-order");

  if (!button) return;

  const orderId = button.dataset.orderId;

  if (!confirm("Delete this order?")) return;

  const response = await fetch(
    "https://lumen-co-full-stack-e-commerce-website.onrender.com/api/orders/" + orderId,
    {
      method: "DELETE"
    }
  );

  const data = await response.json();

  if (data.success) {
    loadOrders();
  }
});


async function loadSubscribers() {
  const response = await fetch("https://lumen-co-full-stack-e-commerce-website.onrender.com/api/subscribers");
  const data = await response.json();

  const subscribersList = document.getElementById("subscribersList");

  if (!data.success || !data.subscribers.length) {
    subscribersList.innerHTML = "<p>No subscribers yet.</p>";
    return;
  }

  subscribersList.innerHTML = data.subscribers.map((subscriber) => `
    <div class="subscriber-card">
      <div>
        <strong>${subscriber.email}</strong>
        <p>${new Date(subscriber.subscribedAt).toLocaleString()}</p>
      </div>

      <button
        class="delete-subscriber"
        data-id="${subscriber._id}"
        type="button"
      >
        Delete
      </button>
    </div>
  `).join("");
}

document.getElementById("subscribersList").addEventListener("click", async (event) => {
  const button = event.target.closest(".delete-subscriber");

  if (!button) return;

  if (!confirm("Delete this subscriber?")) return;

  const response = await fetch(
    "https://lumen-co-full-stack-e-commerce-website.onrender.com/api/subscribers/" + button.dataset.id,
    {
      method: "DELETE"
    }
  );

  const data = await response.json();

  if (data.success) {
    loadSubscribers();
  }
});

loadSubscribers();



loadOrders();



loadProducts();


loadCategories();