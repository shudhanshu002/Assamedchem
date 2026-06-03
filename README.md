# Inventory & Order Management System

## Overview

This project is a full-stack Inventory and Order Management System built using Next.js, Neon PostgreSQL, Prisma ORM, and NextAuth.

The application supports role-based access control with separate Admin and User panels. Users can browse products, search and filter inventory, select quantities in different units, calculate pricing dynamically, and place quotations/orders. Administrators can manage products, monitor inventory levels, review incoming orders, and update order statuses.

The system focuses on accurate unit conversion, high-precision pricing calculations, and a clean inventory workflow.

---

# Features

## Authentication & Authorization

* NextAuth Credentials Authentication
* Secure password hashing using bcrypt
* Role-Based Access Control (RBAC)
* Admin and User roles
* Route protection using Next.js Middleware

### Admin Access

* Dashboard
* Product Management
* Inventory Monitoring
* Order Review
* Order Status Updates

### User Access

* Product Browsing
* Search & Filtering
* Unit Selection
* Price Calculation
* Order Placement
* Order Tracking

---

# Technology Stack

## Frontend

* Next.js 16 (App Router)
* React
* TypeScript
* Tailwind CSS

### Why Next.js?

Next.js provides:

* Server Components
* API Routes
* Middleware
* Optimized Rendering
* Easy Vercel Deployment

This allows the entire application to be built within a single codebase while maintaining good performance and scalability.

---

## Backend

Backend functionality is implemented using:

* Next.js Route Handlers
* Server Components
* Prisma ORM

### Why Prisma?

Prisma provides:

* Type-safe database access
* Easy schema management
* Migrations
* Strong TypeScript support

---

## Database

Database:

* Neon PostgreSQL

### Why PostgreSQL?

PostgreSQL provides:

* ACID transactions
* Decimal precision support
* Reliability
* Strong relational modeling

### Why Neon?

Neon offers:

* Serverless PostgreSQL
* Automatic scaling
* Easy Vercel integration
* Connection pooling support

---

# High-Level Architecture

User Browser
↓
Next.js Frontend
↓
Server Components / API Routes
↓
Prisma ORM
↓
Neon PostgreSQL

Authentication Flow:

User
↓
NextAuth
↓
Credentials Validation
↓
JWT Session
↓
Role-Based Middleware

---

# Database Design

## User

Stores:

* User information
* Credentials
* Role

Fields:

* id
* name
* email
* password
* role

---

## Product

Stores inventory information.

Fields:

* id
* name
* sku
* description
* dimension
* baseUnit
* stockBaseQty
* pricePerBaseQty

---

## Order

Stores quotations/orders.

Fields:

* id
* userId
* status
* totalAmount

---

## OrderItem

Stores individual products inside an order.

Fields:

* orderQty
* orderUnit
* baseQty
* pricePerBaseQty
* lineTotal

This design allows auditing of both:

* User-entered quantity
* Internal converted quantity

---

# Unit Storage Strategy

The system stores all inventory using base units.

## Weight

Internal Storage:

* grams (g)

Supported User Units:

* g
* kg

Conversion:

1 kg = 1000 g

---

## Volume

Internal Storage:

* milliliters (mL)

Supported User Units:

* mL
* L

Conversion:

1 L = 1000 mL

---

## Count

Internal Storage:

* UNIT

Supported User Units:

* UNIT

Conversion:

1 UNIT = 1 UNIT

---

# Pricing Strategy

Prices are stored per base unit.

Examples:

Rice:

* Base Unit = g
* Price = ₹0.08 per gram

Milk:

* Base Unit = mL
* Price = ₹0.06 per mL

When a user orders:

2 kg Rice

System converts:

2 kg → 2000 g

Calculation:

2000 × ₹0.08 = ₹160

This ensures consistent pricing regardless of the unit entered by the user.

---

# Precision Handling

The system uses PostgreSQL NUMERIC/DECIMAL fields.

Example:

Decimal(30,6)

Used for:

* stockBaseQty
* pricePerBaseQty
* baseQty
* totalAmount
* lineTotal

Reason:

Floating point numbers can introduce rounding errors.

Using Decimal ensures accurate inventory and pricing calculations.

---

# Product Search & Filtering

Users can:

* Search by name
* Search by SKU
* Filter by:

  * Weight Products
  * Volume Products
  * Count Products

---

# Order Flow

1. User logs in
2. User browses products
3. User selects quantity
4. User selects unit
5. Quantity converts to base unit
6. Price calculated dynamically
7. Order created
8. Inventory updated
9. Admin reviews order
10. Admin approves/rejects order

---

# Validation

Zod is used for:

* Product validation
* Order validation
* Status validation

This prevents invalid data from entering the system.

---

# Environment Variables

Create a `.env` file:

DATABASE_URL=your_neon_database_url

NEXTAUTH_SECRET=your_secret

NEXTAUTH_URL=http://localhost:3000

---

# Local Setup

Install dependencies:

npm install

Run migrations:

npx prisma migrate dev

Seed database:

npx prisma db seed

Start development server:

npm run dev

---

# Test Credentials

Admin:

Email: [admin@test.com](mailto:admin@test.com)

Password: admin123

User:

Email: [user@test.com](mailto:user@test.com)

Password: user123

---

# Deployment

Frontend and backend are deployed on Vercel.

Deployment Steps:

1. Push project to GitHub
2. Import repository into Vercel
3. Configure environment variables
4. Connect Neon PostgreSQL
5. Deploy

---

# Future Improvements

* Pagination
* Bulk Orders
* Inventory Alerts
* Category Management
* CSV Export
* Audit Logs
* Email Notifications
* Analytics Dashboard

---

# Conclusion

This project demonstrates a complete inventory and quotation workflow using modern full-stack technologies. The solution focuses on accurate unit conversion, precise monetary calculations, role-based access control, and maintainable architecture suitable for future scaling.
