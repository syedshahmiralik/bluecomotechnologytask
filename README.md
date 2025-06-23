# bluecomotechnologytask
The Front End Is Developed In React And Backend Is Using Dot Net Technology


Product Management API - Backend
This is a backend API for managing products, built with ASP.NET Core and Entity Framework Core.

Features
CRUD operations for products

Pagination, filtering, and search

SQL Server database integration

Swagger/OpenAPI documentation

CORS support for frontend integration

Prerequisites
.NET 6.0 SDK or later

SQL Server (or modify connection string for other database providers)

Node.js (if running the frontend)

Setup
Database Setup:

Update the connection string in appsettings.json to point to your SQL Server instance:

json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=ProductDatabase;Trusted_Connection=True;Encrypt=False;MultipleActiveResultSets=true"
}
Run Migrations:

The database will be automatically created and seeded when you run the application.

Run the Application:

bash
dotnet run
API Endpoints
The API will be available at https://localhost:5001 or http://localhost:5000 with the following endpoints:

GET /api/products - Get paginated list of products

GET /api/products/{id} - Get a single product by ID

POST /api/products - Create a new product

PUT /api/products/{id} - Update an existing product

DELETE /api/products/{id} - Delete a product

Query Parameters for GET /api/products
page (default: 1) - Page number

limit (default: 10) - Items per page (max 100)

search - Search term to filter by name or description

category - Filter by category

Development
Swagger UI: Available at /swagger when running in development environment

CORS: Configured to allow requests from http://localhost:3000 and http://localhost:5173

Database Schema
The Products table has the following structure:

Id (int, PK)

Name (string, required)

Description (string)

Price (decimal)

Category (string, required)

Stock (int)

CreatedAt (datetime, defaults to UTC now)

Seed Data
The database is seeded with 10 sample products on first run.

Dependencies
Microsoft.EntityFrameworkCore

Microsoft.EntityFrameworkCore.SqlServer

Microsoft.EntityFrameworkCore.Design

Swashbuckle.AspNetCore (for Swagger)




Frontend Documentation
Overview
The Product Manager is a React-based single-page application that provides a comprehensive interface for managing product inventory with full CRUD (Create, Read, Update, Delete) operations. The application features a modern, responsive design with a gradient background and card-based product display.

Features
Product Listing: Displays products in a responsive grid layout

Search & Filter: Allows searching by name/description and filtering by category

Pagination: Server-side pagination support

CRUD Operations: Full support for creating, reading, updating, and deleting products

Responsive Design: Works on all device sizes

Visual Indicators: Color-coded categories and stock levels

Loading States: Visual feedback during API operations

Error Handling: Displays user-friendly error messages

Technical Details
Dependencies
React (with hooks: useState, useEffect)

Lucide React icons (for UI icons)

JSX CSS styling (scoped styles)

Component Structure
The application is implemented as a single functional component (ProductManager) with several logical sections:

State Management:

Product data and UI state

Form state for add/edit operations

Loading and error states

API Integration:

Fetching products with pagination, search, and filtering

Creating/updating products

Deleting products

UI Sections:

Header with statistics

Search and filter controls

Product grid/cards

Add/edit modal form

Loading and empty states

Key Functions
fetchProducts: Retrieves products from the API with current filters

handleEdit: Prepares the form for editing an existing product

saveProduct: Handles both creating new and updating existing products

deleteProduct: Deletes a product after confirmation

getCategoryColor: Provides consistent color coding for categories

Styling Approach
The component uses JSX CSS styling with:

Responsive design using clamp() and media queries

Modern UI elements with subtle animations

Gradient backgrounds and glass-morphism effects

Color-coded categories and status indicators

Usage
Props
This component doesn't accept any props as it manages all its state internally.

Environment Requirements
The application expects an API endpoint at https://localhost:7270/api with the following endpoints:

GET /products - Retrieve paginated product list

POST /products - Create new product

PUT /products/{id} - Update existing product

DELETE /products/{id} - Delete product

The API should return data in the ApiResponse<T> format defined in the types.

Code Structure
Types
typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
}

interface ApiResponse<T> {
  data: T;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}
Constants
typescript
const API_BASE_URL = 'https://localhost:7270/api';
const pageSize = 10;
const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];
State Management
typescript
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [searchTerm, setSearchTerm] = useState('');
const [categoryFilter, setCategoryFilter] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalCount, setTotalCount] = useState(0);
const [showAddForm, setShowAddForm] = useState(false);
const [editingProduct, setEditingProduct] = useState<Product | null>(null);
const [formData, setFormData] = useState<ProductFormData>({
  name: '',
  description: '',
  price: 0,
  category: '',
  stock: 0
});
const [submitting, setSubmitting] = useState(false);
Responsive Design
The component includes responsive breakpoints at:

768px: Adjusts control layout

640px: Stacks form elements and adjusts grid layout

480px: Stacks modal action buttons

Accessibility Considerations
Semantic HTML structure

Proper labeling for form inputs

Sufficient color contrast

Focus states for interactive elements

Error Handling
Network errors are caught and displayed to the user

Confirmation dialogs for destructive actions

Visual feedback during API operations

Future Improvements
Implement client-side pagination controls

Add sorting options

Enhance form validation

Add image upload support

Implement user authentication

Add bulk operations

Export functionality (CSV/Excel)

This documentation provides a comprehensive overview of the Product Manager frontend component, its features, implementation details, and usage considerations.