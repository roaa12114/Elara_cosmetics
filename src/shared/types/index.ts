export type Role = "customer" | "seller" | "admin";

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

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  product: string;
  seller: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export interface Order {
  _id: string;
  user: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  previewDiscount?: number;
}

export interface OrderData {
  order: Order;
}

export interface PaginatedOrdersData {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateOrderRequest {
  cartId: string;
  shippingAddress: ShippingAddress;
}

export interface PromoSummary {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
}

export interface PromoValidationData {
  promo: PromoSummary;
  subtotal: number;
  discount: number;
  finalTotal: number;
}

export interface ValidatePromoRequest {
  code: string;
}

export interface CheckoutPreviewData {
  order: Order;
}

export interface CheckoutPreviewRequest {
  orderId: string;
  promoCode?: string;
}

export interface CheckoutData {
  url: string;
  [key: string]: unknown;
}

export interface CheckoutRequest {
  orderId: string;
}

export type ProductsSort = "price_asc" | "price_desc" | "newest" | "oldest";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: ProductsSort;
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

export interface Notification {
  _id: string;
  user_id: string;
  type: string;
  title: string;
  content: string;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsData {
  notifications: Notification[];
}

export interface WishlistItem {
  _id: string;
  seller: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistData {
  wishlist: WishlistItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: string[];
}