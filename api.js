/**
 * Backend hook.
 * The shop only talks to this file. Swap the bodies for real fetch calls
 * when your API is ready. Expected product shape:
 * { id, name, category, price, tag, image, description }
 */
const API_BASE ="https://lumen-co-full-stack-e-commerce-website.onrender.com/api";

const api = {
  async getProducts() {
    const response = await fetch(API_BASE + "/products");
    const data = await response.json();

    return data.products;
  },

  async placeOrder(order) {
    const response = await fetch(API_BASE + "/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    return await response.json();
  },
};
