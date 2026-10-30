import { Route, Routes } from "react-router-dom";
import { PublicOnly, RequireRole } from "./guards";
import { AuthLayout } from "@layouts/AuthLayout";
import { CustomerLayout } from "@layouts/CustomerLayout";
import { SellerLayout } from "@layouts/SellerLayout";
import { AdminLayout } from "@layouts/AdminLayout";
import { SignInPage } from "@features/auth/pages/SignInPage";
import { SignUpPage } from "@features/auth/pages/SignUpPage";
import { ConfirmEmailPage } from "@features/auth/pages/ConfirmEmailPage";
import { SellerSignInPage } from "@features/seller/pages/SellerSignInPage";
import { SellerSignUpPage } from "@features/seller/pages/SellerSignUpPage";
import { HomePage } from "@features/customer/pages/HomePage";
import { SellerDashboardPage } from "@features/seller/pages/SellerDashboardPage";
import { AdminDashboardPage } from "@features/admin/pages/AdminDashboardPage";
import { NotFoundPage } from "@pages/NotFoundPage";
import { DevShowcasePage } from "@pages/DevShowcasePage";
import { BrandsPage } from "@features/customer/pages/BrandsPage";
import { BrandDetailPage } from "@features/customer/pages/BrandDetailPage";
import { ProductDetailPage } from "@features/customer/pages/ProductDetailPage";
import { BundlesPage } from "@features/customer/pages/BundlesPage";
import { BundleDetailPage } from "@features/customer/pages/BundleDetailPage";
import { OffersPage } from "@features/customer/pages/OffersPage";
import { CartPage } from "@features/customer/pages/CartPage";
import { CheckoutPage } from "@features/customer/pages/CheckoutPage";
import { AccountLayout } from "@layouts/AccountLayout";
import { ProfilePage } from "@features/customer/pages/account/ProfilePage";
import { AddressesPage } from "@features/customer/pages/account/AddressesPage";
import { MyOrdersPage } from "@features/customer/pages/account/MyOrdersPage";
import { OrderDetailPage } from "@features/customer/pages/account/OrderDetailPage";
import { ReturnsPage } from "@features/customer/pages/account/ReturnsPage";
import { WishlistPage } from "@features/customer/pages/account/WishlistPage";
import { ManageCardsPage } from "@features/customer/pages/account/ManageCardsPage";
import { NotificationsPage } from "@features/customer/pages/account/NotificationsPage";
import { CancelItemsPage } from "@features/customer/pages/account/CancelItemsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/dev" element={<DevShowcasePage />} />

      {/* Auth routes — public-only, share AuthLayout (header + footer) */}
      <Route element={<AuthLayout />}>
        <Route
          path="/sign-in"
          element={
            <PublicOnly>
              <SignInPage />
            </PublicOnly>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicOnly>
              <SignUpPage />
            </PublicOnly>
          }
        />
        <Route
          path="/confirm-email"
          element={
            <PublicOnly>
              <ConfirmEmailPage />
            </PublicOnly>
          }
        />
        <Route
          path="/seller/sign-in"
          element={
            <PublicOnly>
              <SellerSignInPage />
            </PublicOnly>
          }
        />
        <Route
          path="/seller/sign-up"
          element={
            <PublicOnly>
              <SellerSignUpPage />
            </PublicOnly>
          }
        />
      </Route>

      {/* Customer tree */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/brands/:categorySlug" element={<BrandsPage />} />
        <Route
          path="/brands/:categorySlug/:brandSlug"
          element={<BrandDetailPage />}
        />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/bundles" element={<BundlesPage />} />
        <Route path="/bundles/:bundleSlug" element={<BundleDetailPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Customer account tree — all wrapped in AccountLayout (sidebar + breadcrumb) */}
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<MyOrdersPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="addresses" element={<AddressesPage />} />
          <Route path="orders" element={<MyOrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="orders/:id/cancel" element={<CancelItemsPage />} />
          <Route path="returns" element={<ReturnsPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="cards" element={<ManageCardsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Seller tree (dashboard only — auth routes are above under AuthLayout) */}
      <Route
        path="/seller"
        element={
          <RequireRole roles={["seller"]}>
            <SellerLayout />
          </RequireRole>
        }
      >
        <Route index element={<SellerDashboardPage />} />
      </Route>

      {/* Admin tree */}
      <Route
        path="/admin"
        element={
          <RequireRole roles={["admin"]}>
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<AdminDashboardPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}