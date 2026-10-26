// All shapes below are typed from REAL API responses (Rule 6).
// Do not edit unless a new real response has been pasted by the user.

// ===== Auth types (Phase 1) =====

export type Role = 'customer' | 'seller' | 'admin';

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  isEmailConfirmed: boolean;
  isActive: boolean;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginData {
  accessToken: string;
  user: User;
}
export type LoginResponse = ApiEnvelope<LoginData>;

export interface RegisterCustomerData {
  user: User;
}
export type RegisterCustomerResponse = ApiEnvelope<RegisterCustomerData>;

export interface RegisterSellerData {
  user: User;
}
export type RegisterSellerResponse = ApiEnvelope<RegisterSellerData>;

export interface ConfirmEmailResponse {
  success: boolean;
  message: string;
}

export interface MeData {
  user: User;
}
export type MeResponse = ApiEnvelope<MeData>;

// ===== Phase 2: Product + Category + Cart types =====

export interface ProductSellerSummary {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface ProductCategorySummary {
  _id: string;
  name: string;
  description?: string;
}

export interface Product {
  _id: string;
  seller: ProductSellerSummary;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategorySummary;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProductsData {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductData {
  product: Product;
}

// Category — typed from GET /categories response
export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCategoriesData {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Cart types
export interface CartItemProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
}

export interface CartItem {
  product: CartItemProduct;
  quantity: number;
  lineTotal: number;
}

export interface Cart {
  cartId: string;
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CartData {
  cart: Cart;
}

// ===== Request shapes =====

// Sort enum confirmed by hitting public endpoint — backend rejects other values
// with: "Invalid enum value. Expected 'price_asc' | 'price_desc' | 'newest' | 'oldest'"
export type ProductsSort = 'price_asc' | 'price_desc' | 'newest' | 'oldest';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: ProductsSort;
  // TODO: confirm category + brand + price range filters with user when needed
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCustomerRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: Address;
}

export interface RegisterSellerRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: Address;
}

export interface ConfirmEmailRequest {
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}
