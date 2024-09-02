const express = require("express");
const adminRouter = express.Router();
const { Product } = require("../models/product");
const Order = require("../models/order");
const { PromiseProvider } = require("mongoose");

// Add product
adminRouter.post("/admin/add-product", async (req, res) => {
  try {
    const { name, description, images, quantity, price, category,addedby } = req.body;
    let product = new Product({
      name,
      description,
      images,
      quantity,
      price,
      category,
      ratings:[],
      addedby
    });
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/admin/update-product", async (req, res) => {
  try {
    const { id, name, description, quantity, price, images } = req.body;
    await Product.findByIdAndUpdate(id, {$set:{name:name,description:description,quantity:quantity,price:price,images:images}});
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all your products
adminRouter.get("/admin/get-products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete the product
adminRouter.post("/admin/delete-product", async (req, res) => {
  try {
    const { id } = req.body;
    let product = await Product.findByIdAndDelete(id);
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/admin/get-orders", async (req, res) => {
  try {
    const { store } = req.body;
    const orders = await Order.find({store:store});
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/admin/change-order-status", async (req, res) => {
  try {
    const { id, status } = req.body;
    let order = await Order.findById(id);
    order.status = status;
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/admin/analytics", async (req, res) => {
  try {
    const { store } = req.body;
    const orders = await Order.find({store:store});
    let totalEarnings = 0;

    for (let i = 0; i < orders.length; i++) {
      for (let j = 0; j < orders[i].products.length; j++) {
        totalEarnings +=
          orders[i].products[j].quantity * orders[i].products[j].product.price;
      }
    }
    // CATEGORY WISE ORDER FETCHING
    let mobileEarnings = await fetchCategoryWiseProduct("Shirt",store);
    let essentialEarnings = await fetchCategoryWiseProduct("Pents",store);
    let applianceEarnings = await fetchCategoryWiseProduct("Shoes",store);
    let booksEarnings = await fetchCategoryWiseProduct("Underwear",store);
    let fashionEarnings = await fetchCategoryWiseProduct("Tie",store);

    let to = mobileEarnings['l']+essentialEarnings['l']+applianceEarnings['l']+booksEarnings['l']+fashionEarnings['l'];

    let earnings = {
      totalEarnings,
      mobileEarnings: mobileEarnings.earnings,
      essentialEarnings: essentialEarnings.earnings,
      applianceEarnings: applianceEarnings.earnings,
      booksEarnings: booksEarnings.earnings,
      fashionEarnings: fashionEarnings.earnings,
      to
    };

    res.json(earnings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

async function fetchCategoryWiseProduct(category,store) {
  let earnings = 0;
  let categoryOrders = await Order.find({
    "products.product.category": category,
    store:store
  });

  for (let i = 0; i < categoryOrders.length; i++) {
    for (let j = 0; j < categoryOrders[i].products.length; j++) {
      earnings +=
        categoryOrders[i].products[j].quantity *
        categoryOrders[i].products[j].product.price;
    }
  }
  return {earnings:earnings,l:categoryOrders.length};
}

module.exports = adminRouter;