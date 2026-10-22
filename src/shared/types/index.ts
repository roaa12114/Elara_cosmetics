// All shapes below are typed from REAL API responses (Rule 6).
// Do not edit unless a new real response has been pasted by the user.

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

// Backend wraps responses in { success, message, data } (confirmed via real responses)
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// Confirmed response data shapes
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

// confirm-email has NO data field — just success + message (no role, no user)
export interface ConfirmEmailResponse {
  success: boolean;
  message: string;
}

export interface MeData {
  user: User;
}
export type MeResponse = ApiEnvelope<MeData>;

// Request shapes (what the frontend sends)
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
