Lumen & Co. — Full-Stack E-commerce Website

A modern full-stack e-commerce website built with HTML, CSS, JavaScript, Node.js, Express, MongoDB and Mongoose.

The project includes a customer storefront and an admin dashboard for managing products, categories, orders and newsletter subscribers.

---

✨ Features

Customer Store

- Modern responsive design
- Product listing
- Product categories
- Product search
- Product sorting
- Product details
- Shopping cart
- Checkout
- Order submission
- Newsletter subscription
- Mobile responsive layout

Admin Dashboard

- Add products
- Edit products
- Delete products
- Upload product images
- Manage categories
- View orders
- Update order status
- View newsletter subscribers
- Delete subscribers

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- Nodemailer
- REST API

---

📁 Project Structure

Lumen & Co.
│
├── backend/
│   ├── models/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
└── admin/
    ├── index.html
    ├── style.css
    └── app.js

---

⚙️ Requirements

Before running the project, install:

- Node.js
- MongoDB account
- A Gmail account if you want newsletter emails
- A code editor such as VS Code

---

🚀 Installation

Open the backend folder in your terminal:

cd backend

Install the dependencies:

npm install

---

🔐 Environment Variables

Create a file called:

.env

inside the "backend" folder.

Add:

MONGODB_URI=your_mongodb_connection_string

EMAIL_USER=your_gmail@gmail.com

EMAIL_PASSWORD=your_gmail_app_password

MongoDB

Create your own MongoDB database and copy your MongoDB connection string into:

MONGODB_URI=

Do not use someone else's MongoDB connection string.

---

📧 Gmail Setup

The newsletter feature uses Nodemailer to send a welcome email.

You should not use your normal Gmail password.

Create a Google App Password and put the generated password in:

EMAIL_PASSWORD=

Keep your ".env" file private.

---

▶️ Start the Backend

Inside the "backend" folder, run:

node server.js

You should see:

Server running on http://localhost:3000
MongoDB connected

The backend will now be available at:

http://localhost:3000

---

🛍️ Customer Website

Open the customer frontend:

frontend/index.html

The frontend communicates with the backend API.

If you change the backend URL, update the API URL inside the frontend JavaScript.

For example:

const IMAGE_BASE = "http://localhost:3000";

When deploying the website, replace the localhost URL with your deployed backend URL.

---

🛠️ Admin Dashboard

Open:

admin/index.html

The admin dashboard allows you to manage:

- Products
- Categories
- Orders
- Subscribers

---

🎨 Customizing the Website

You can customize the project to match your own brand.

Brand Name

Search the frontend files for:

Lumen & Co.

Replace it with your business name.

---

Colors

The main colors are controlled through the CSS files.

You can change the colors to match your brand.

---

Fonts

The website uses Google Fonts.

You can change the fonts inside the HTML "<head>" section.

---

Hero Section

The homepage hero text can be changed inside:

frontend/index.html

You can change:

- Heading
- Description
- Button text
- Images

---

Products

Products are managed through the admin dashboard.

You can add your own:

- Product name
- Price
- Category
- Description
- Product image

You do not need to manually edit the product HTML.

---

Categories

Categories can be created from the admin dashboard.

The customer website automatically displays the available product categories.

---

🖼️ Product Images

Product images can be uploaded through the admin dashboard.

Make sure the images are suitable for your products and are optimized for web use.

---

📧 Newsletter

Customers can enter their email address in the newsletter section.

The email is saved in MongoDB and the system can send a welcome email using Nodemailer.

Newsletter subscribers can be viewed from the admin dashboard.

---

🛒 Orders

When a customer completes checkout, the order is sent to the backend and saved in MongoDB.

The admin can view the orders from the dashboard and update their status.

---

🌐 Deployment

The project currently uses:

http://localhost:3000

for local development.

Before deploying, you will need to:

1. Deploy the Node.js/Express backend.
2. Set up MongoDB.
3. Add your environment variables to your hosting provider.
4. Update the frontend API URL.
5. Deploy the frontend.
6. Update any image/API URLs that still point to localhost.

---

🔒 Important Security Notes

Never upload your ".env" file publicly.

Do not share:

- MongoDB connection strings
- Gmail passwords
- Gmail App Passwords
- API keys
- Other private credentials

The buyer should create their own accounts and credentials.

---

📦 Included With This Product

You receive:

- Full frontend source code
- Full backend source code
- Admin dashboard
- MongoDB/Mongoose setup
- Product management
- Category management
- Order management
- Newsletter system
- Image upload system
- Installation instructions

---

💡 Before You Start

This is a source-code project.

You will need basic knowledge of:

- HTML
- CSS
- JavaScript
- Node.js
- MongoDB

You are responsible for setting up your own hosting, database, email account and domain.

---

## Created by KKunlimited

This project was designed and developed by **KKunlimited**.

Thank you for purchasing the project.