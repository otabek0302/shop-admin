# 🛒 Shop Admin Panel

A modern and scalable admin panel for managing products and orders, built with Next.js, TypeScript, Prisma ORM, and Tailwind CSS.

## 🚀 Features

- 🧑‍💼 **User & Role Management**
  - User authentication and authorization
  - Role-based access control (Admin/User)
  - User profile management

- 📦 **Product Management**
  - Create, read, update, and delete products
  - Product categorization
  - Stock management
  - Product image upload

- 🧾 **Order Tracking**
  - Order creation and management
  - Order status updates
  - Order history
  - Order details view

- 📊 **Dashboard & Analytics**
  - Sales overview
  - Order statistics
  - Product performance metrics
  - Revenue tracking

- 🔒 **Security**
  - Secure authentication
  - Role-based permissions
  - API route protection
  - Data validation

## 🧱 Tech Stack

| Technology    | Description                              |
|--------------|------------------------------------------|
| Next.js      | React framework for server-side rendering |
| TypeScript   | Type-safe JavaScript                      |
| Prisma       | Next-gen ORM for database operations     |
| PostgreSQL   | Production-ready database                 |
| Tailwind CSS | Utility-first CSS framework              |
| NextAuth.js  | Authentication and authorization          |
| Zod          | Schema validation                        |

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/otabek0302/shop-admin.git
cd shop-admin
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/shop_admin?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                # Next.js app router
│   ├── api/           # API routes
│   ├── products/      # Product pages
│   ├── orders/        # Order pages
│   └── users/         # User pages
├── components/        # Reusable components
├── lib/              # Utility functions
├── prisma/           # Database schema
└── styles/           # Global styles
```

## 🧪 Available Scripts

| Command           | Description                          |
|------------------|--------------------------------------|
| `npm run dev`    | Start development server             |
| `npm run build`  | Build for production                 |
| `npm run start`  | Start production server              |
| `npm run lint`   | Run ESLint                          |
| `prisma studio`  | Open Prisma Studio (DB GUI)         |
| `prisma migrate` | Run database migrations              |

## 🔐 Authentication

The application uses NextAuth.js for authentication. Default credentials:
- Admin: admin@example.com / admin123
- User: user@example.com / user123

## 📝 API Documentation

### Products API
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product details
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Orders API
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status

### Users API
- `GET /api/users` - List all users (admin only)
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables
4. Deploy!

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm run start`

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For any questions or support, please contact:
- Email: otabekjon0302@gmail.com
- GitHub Issues: [Create an issue](https://github.com/otabek0302/shop-admin/issues)
