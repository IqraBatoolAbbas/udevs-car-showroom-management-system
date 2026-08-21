# U Devs Car Showroom Management System

IMPORTANT (Demo): This is a frontend-only prototype. All data (including seeded and created user passwords) are stored in LocalStorage in plaintext for demonstration purposes only. Do NOT use these credentials or this storage pattern in production. The README contains the seeded credentials for reviewer convenience.

A comprehensive React-based car showroom management and customer portal application. This system demonstrates professional frontend development with role-based access control, full CRUD operations, and LocalStorage persistence.

---

Reviewer checklist (quick):
1. Start the app: `npm install` then `npm run dev` and open the port shown (default http://localhost:5173).
2. Login with seeded accounts (see "Dummy Login Credentials" below): Admin, Sales, Inventory, Customer.
3. As Admin: create a car (Admin → Cars → Add New Car). Refresh page — car must persist.
4. As Admin: create a supplier and link it to a car; try deleting a supplier with linked cars (should be blocked).
5. As Customer: browse Showroom → Car Details → select an available color and Apply. Confirm application appears in My Applications and in Admin Applications.
6. As Admin/Sales: open Applications → update status (Pending → Approved/Reserved/Completed/Rejected) and verify notification and activity log entries.
7. Verify: profit and profit margin calculated automatically on car add/edit; search/filter/sort work across cars.
8. Verify: customers see only their own applications (privacy enforced).

Notes for repository submission:
- Ensure `node_modules` and `dist` are not committed. If present, remove them from git history before publishing and confirm `.gitignore` is in place.
- The app is intentionally offline/demo-only: no backend, no real authentication, no payment/email services.

---


## 🚀 Features

### For Admin/Staff:
- **Dashboard**: Real-time KPIs showing inventory, applications, customers, and profit metrics
- **Cars Management**: Full CRUD operations with search, filter, and sort capabilities
- **Suppliers Management**: Complete supplier database with car linking
- **Applications Management**: Track and update customer application statuses
- **Activity Logging**: Audit trail of all system activities
- **Role-Based Access**: Different dashboards for Admin, Sales, and Inventory roles

### For Customers:
- **Customer Portal**: Dedicated interface for browsing and applying for cars
- **Showroom**: Advanced filtering by make, model, price, fuel type, and transmission
- **Car Details**: Comprehensive vehicle information with image galleries
- **Application System**: Easy car application process with status tracking
- **My Applications**: Personal dashboard to track application progress

## 🛠 Technology Stack

- **Frontend**: React 19.2.8 with functional components and hooks
- **UI Framework**: Material UI (MUI) for responsive design
- **Routing**: React Router DOM for navigation
- **Styling**: Custom CSS with MUI theming
- **Data Persistence**: LocalStorage (no backend required)
- **Build Tool**: Vite 8.2.2
- **Language**: JavaScript/JSX

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "CAR SHOWROOM MANAGEMENT SYSTEM"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📁 Project Structure

```
src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components
│   ├── common/         # Shared components (StatCard, PageHeader, etc.)
│   ├── cars/           # Car-specific components
│   ├── applications/   # Application components
│   ├── customers/      # Customer components
│   └── suppliers/      # Supplier components
├── context/            # React context (AuthContext)
├── data/               # Seed data for initial setup
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts (AdminLayout, CustomerLayout)
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── staff/          # Staff pages
│   ├── customer/       # Customer pages
│   └── auth/           # Authentication pages
├── routes/             # Route configuration
├── services/           # Business logic services
├── theme/              # MUI theme configuration
├── utils/              # Utility functions (validators, formatters)
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## 🔐 Dummy Login Credentials

### Admin
- **Email**: admin@udevs.com
- **Password**: Admin@123
- **Access**: Full system access including users, settings, and reports

### Sales Manager
- **Email**: sales@udevs.com
- **Password**: Sales@123
- **Access**: Dashboard, showroom, customers, and applications

### Inventory Manager
- **Email**: inventory@udevs.com
- **Password**: Inventory@123
- **Access**: Dashboard, cars, suppliers, and inventory reports

### Customer
- **Email**: customer@udevs.com
- **Password**: Customer@123
- **Access**: Customer portal, showroom, and personal applications

## 🎯 Role Permissions

| Feature | Admin | Sales | Inventory | Customer |
|---------|-------|-------|-----------|-----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Cars Management | ✅ | ❌ | ✅ | ❌ |
| Suppliers Management | ✅ | ❌ | ✅ | ❌ |
| Customers Management | ✅ | ✅ | ❌ | ❌ |
| Applications Management | ✅ | ✅ | ❌ | Own only |
| Users Management | ✅ | ❌ | ❌ | ❌ |
| Reports | ✅ | ❌ | ✅ | ❌ |
| Settings | ✅ | ❌ | ❌ | ❌ |
| Showroom | ✅ | ✅ | ❌ | ✅ |
| Profile | ✅ | ✅ | ✅ | ✅ |

## 💾 LocalStorage Keys

The application uses the following LocalStorage keys:

- `udevs_users` - User accounts and role data
- `udevs_session` - Current user session
- `udevs_cars` - Car inventory
- `udevs_suppliers` - Supplier records
- `udevs_customers` - Customer information
- `udevs_applications` - Car applications/orders
- `udevs_notifications` - System notifications
- `udevs_activity_logs` - Activity audit trail
- `udevs_settings` - System settings

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Professional Theme**: Navy blue and cyan color scheme with clean typography
- **Interactive Components**: 
  - Confirmation dialogs for destructive actions
  - Status chips for workflow states
  - Color selectors for car options
  - Search and filter controls
- **Empty States**: User-friendly messages when no data is available
- **Loading States**: Visual feedback during data operations
- **Error Handling**: Comprehensive validation and error messages

## ✅ Validation Rules

### Car Management
- Required fields: Make, Model, Variant, Year, Purchase Rate, Selling Price, Colors, Stock, Fuel, Transmission, Status, Supplier
- Selling price must not be lower than purchase rate (with warning)
- Stock must be non-negative integer
- Year must be between 2000 and current year + 2

### Supplier Management
- Required fields: Company Name, Contact Person, Email, Phone, Address, City
- Email format validation
- Phone number format validation (Pakistani format)

### Application Form
- Required fields: Full Name, Email, CNIC, Cell Number, Address, City, Selected Car, Selected Color
- Email format validation
- CNIC format validation (XXXXX-XXXXXXX-X)
- Phone number format validation (Pakistani format)

## 🔄 Application Workflow

1. **Admin/Inventory Setup**:
   - Create supplier accounts
   - Add cars to inventory with pricing and specifications
   - Set stock levels and availability

2. **Customer Journey**:
   - Browse showroom with filters
   - View detailed car information
   - Select color and submit application
   - Track application status in personal dashboard

3. **Staff Processing**:
   - Review applications in dashboard
   - Update application status (Pending → Approved → Reserved → Completed)
   - Manage inventory levels
   - Generate reports

## 📊 Key Features

### Automatic Calculations
- **Profit**: Selling Price - Purchase Rate
- **Profit Margin**: (Profit ÷ Selling Price) × 100
- **Stock Alerts**: Low stock warnings when quantity ≤ 3
- **KPI Updates**: Real-time dashboard metrics

### Data Management
- **Search**: Full-text search across cars and suppliers
- **Filter**: Multiple filter options (status, fuel type, price range, etc.)
- **Sort**: Sort by price, year, stock, name
- **Pagination**: Efficient data display for large datasets

### Security Features
- **Role-Based Access Control**: Users see only permitted modules
- **Session Management**: Secure login/logout functionality
- **Data Isolation**: Customers see only their own applications
- **Activity Logging**: Audit trail of all system changes

## 🧪 Testing Checklist

- [x] Admin login and dashboard access
- [x] Role-based navigation and permissions
- [x] Car Create, Read, Update, Delete operations
- [x] Supplier management with car linking
- [x] Application status workflow
- [x] Customer showroom browsing
- [x] Application submission and tracking
- [x] Search, filter, and sort functionality
- [x] Responsive design on mobile devices
- [x] Form validation and error handling
- [x] LocalStorage data persistence
- [x] Automatic profit calculations

## ⚠️ Known Limitations

1. **No Backend**: All data stored in LocalStorage (cleared when browser cache is cleared)
2. **No Real Authentication**: Login is simulated with seeded users
3. **No Payment Processing**: Applications are for demonstration only
4. **No Email/SMS**: Notifications are simulated within the application
5. **Single Device**: LocalStorage is device-specific
6. **Image Storage**: Uses external URLs (no actual file upload)

## 🚀 Future Improvements

- Backend integration with Node.js/Express
- Real database (MongoDB/PostgreSQL)
- Real authentication with JWT
- Payment gateway integration
- Email/SMS notification system
- File upload for car images
- Advanced reporting with charts
- Multi-language support
- Dark/light mode toggle
- Mobile app version

## 📞 Support

For issues or questions, please contact:
- **Email**: info@udevs-showroom.com
- **Project**: U Devs Internship Assignment

## 📝 License

This project is developed as part of the U Devs Internship Program.

---

**Note**: This is a frontend prototype for demonstration purposes. In a production environment, you would need to implement a proper backend with secure authentication and database integration.
