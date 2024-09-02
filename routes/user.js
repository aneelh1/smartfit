const express = require('express');
const { Product } = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');
const userRouter = express.Router();

userRouter.post("/api/add-to-cart", async (req, res) => {
    try {
        const { id,users } = req.body;
        const product = await Product.findById(id);
        let user = await User.findById(users);

        if (user.cart.length == 0) {
            user.cart.push({ product, quantity: 1 });
        }
        else {
            let isProductFound = false;
            for (let i = 0; i < user.cart.length; i++) {
                if (user.cart[i].product._id.equals(product._id)) {
                    isProductFound = true;
                }
            }

            if (isProductFound) {
                let producttt = user.cart.find((producttt) =>
                    producttt.product._id.equals(product._id));
                producttt.quantity += 1;
            }
            else {
                user.cart.push({ product, quantity: 1 });
            }
        }

        user = await user.save();
        res.json(user);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});


userRouter.delete("/api/remove-from-cart/", async (req, res) => {
    try {
        const { id,users } = req.body;
        const product = await Product.findById(id);
        let user = await User.findById(users);

        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].product._id.equals(product._id)) {
                if(user.cart[i].quantity == 1){
                    user.cart.splice(i,1);
                }
                else{
                    user.cart[i].quantity -= 1;
                }
            }
        }

        user = await user.save();
        res.json(user);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});

//save user address
 userRouter.post('/api/save-user-address', async (req, res) => {
    try {
        const {address,users} = req.body;
        let user = await User.findById(users);
        user.address = address;
        user = await user.save();
        res.json(user);
    } catch (e){
        res.status(500).json({error: e.message});
    }
 });

 userRouter.post("/api/order", async (req, res) => {
    try {
      const { cart, totalPrice, address, users ,store, date } = req.body;
      let products = [];
  
      for (let i = 0; i < cart.length; i++) {
        let product = await Product.findById(cart[i].product._id);
        if (product.quantity >= cart[i].quantity) {
          product.quantity -= cart[i].quantity;
          products.push({ product, quantity: cart[i].quantity });
          await product.save();
        } else {
          return res
            .status(400)
            .json({ msg: `${product.name} is out of stock!` });
        }
      }
  
      let user = await User.findById(users);
      user.cart = [];
      user = await user.save();
  
      let order = new Order({
        products,
        totalPrice,
        address,
        userId: users,
        orderedAt: new Date().getTime(),
        store: store,
        date: date,
      });
      order = await order.save();
      res.json(order);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  
  userRouter.post("/api/orders/me", async (req, res) => {
    try {
      const { users } = req.body;
      const orders = await Order.find({ userId: users });
      res.json(orders);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  
module.exports = userRouter;