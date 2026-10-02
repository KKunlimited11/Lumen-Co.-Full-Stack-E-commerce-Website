import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import multer from "multer";
import nodemailer from "nodemailer";

import Subscriber from "./models/Subscriber.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import Order from "./Order.js";

dotenv.config();

const app = express();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});


app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use("/admin", express.static("admin"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("KKUNLIMITED EDIT backend is running");
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const product = await Product.create({
      ...req.body,
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


app.put("/api/products/:id", upload.single("image"), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.name = req.body.name;
        product.category = req.body.category;
        product.price = req.body.price;
        product.tag = req.body.tag;
        product.description = req.body.description;

        if (req.file) {
            const oldImagePath = path.join(__dirname, product.image);

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            product.image = `/uploads/${req.file.filename}`;
        }

        await product.save();

        res.json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});



app.post("/api/categories", async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/categories", async (req, res) => {
    try {
        const categories = await Category.find();

        res.json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


app.delete("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const imagePath = path.join(__dirname, product.image);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Product and image deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.delete("/api/categories/:id", async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);

    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not place order"
    });
  }
});



app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const items = await Promise.all(
          order.items.map(async (item) => {
            const product = await Product.findById(item.productId);

            return {
              productName: product ? product.name : "Product not found",
              price: product ? product.price : 0,
              qty: item.qty
            };
          })
        );

        return {
          ...order.toObject(),
          items
        };
      })
    );

    res.json({
      success: true,
      orders: ordersWithProducts
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not get orders"
    });
  }
});



app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not update order status"
    });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not delete order"
    });
  }
});


app.post("/api/subscribe", async (req, res) => {
  console.log("SUBSCRIBE REQUEST:", req.body);

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.json({
        success: false,
        message: "You are already subscribed"
      });
    }

    await Subscriber.create({ email });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Lumen & Co.",
      text: "Thanks for subscribing to Lumen & Co. We'll keep you updated with new arrivals and thoughtful finds."
    });

    res.json({
      success: true,
      message: "Subscribed successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not subscribe"
    });
  }
});




app.get("/api/subscribers", async (req, res) => {
  try {
    const subscribers = await Subscriber
      .find()
      .sort({ subscribedAt: -1 });

    res.json({
      success: true,
      subscribers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not get subscribers"
    });
  }
});

app.delete("/api/subscribers/:id", async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found"
      });
    }

    res.json({
      success: true,
      message: "Subscriber deleted"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not delete subscriber"
    });
  }
});



app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
