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
import { SellerOverviewPage } from "@features/seller/pages/SellerOverviewPage";
import { SalesAnalyticsPage } from "@features/seller/pages/SalesAnalyticsPage";
import { SalesOverViewPage } from "@features/seller/pages/SalesOverViewPage";
import { SellerProductsPage } from "@features/seller/pages/SellerProductsPage";
import { SellerInventoryPage } from "@features/seller/pages/SellerInventoryPage";
import { SellerOrdersPage } from "@features/seller/pages/SellerOrdersPage";
import { SellerEarningsPage } from "@features/seller/pages/SellerEarningsPage";
import { SellerPayoutsPage } from "@features/seller/pages/SellerPayoutsPage";
import { SellerPromotionsPage } from "@features/seller/pages/SellerPromotionsPage";
import { SellerSettingsPage } from "@features/seller/pages/SellerSettingsPage";
import { AdminDashboardPage } from "@features/admin/pages/AdminDashboardPage";
import { NotFoundPage } from "@pages/NotFoundPage";
import { DevShowcasePage } from "@pages/DevShowcasePage";
import { BrandsPage } from "@features/customer/pages/BrandsPage";
import { BrandDetailPage } from "@features/customer/pages/BrandDetailPage";
import { ProductDetailPage } from "@features/customer/pages/ProductDetailPage";
import { BundlesPage } from "@features/customer/pages/BundlesPage";
import { BundleDetailPage } from "@features/customer/pages/BundleDetailPage";
import { OffersPage } from "@features/customer/pages/OffersPage";
import { SellerAddProductPage } from "@features/seller/pages/SellerAddProductPage";
import { SellerEditProductPage } from "@features/seller/pages/SellerEditProductPage";
import { SellerProductDetailPage } from "@features/seller/pages/SellerProductDetailPage";
import { SellerDiscountsPage } from "@features/seller/pages/SellerDiscountsPage";
import { SellerDiscountDetailPage } from "@features/seller/pages/SellerDiscountDetailPage";
import { SellerPromoCodesPage } from "@features/seller/pages/SellerPromoCodesPage";
import { SellerPromoDetailPage } from "@features/seller/pages/SellerPromoDetailPage";

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
        <Route index element={<SellerOverviewPage />} />
        <Route path="analytics" element={<SalesAnalyticsPage />} />
        <Route path="sales" element={<SalesOverViewPage />} />
        <Route path="products" element={<SellerProductsPage />} />
        <Route path="inventory" element={<SellerInventoryPage />} />
        <Route path="orders" element={<SellerOrdersPage />} />
        <Route path="earnings" element={<SellerEarningsPage />} />
        <Route path="payouts" element={<SellerPayoutsPage />} />
        <Route path="promotions" element={<SellerPromotionsPage />} />
        <Route path="settings" element={<SellerSettingsPage />} />
        <Route path="products" element={<SellerProductsPage />} />
        <Route path="products/new" element={<SellerAddProductPage />} />
        <Route path="products/:id" element={<SellerProductDetailPage />} />
        <Route path="products/:id/edit" element={<SellerEditProductPage />} />
        <Route path="inventory" element={<SellerInventoryPage />} />
        <Route path="discounts" element={<SellerDiscountsPage />} />
        <Route path="discounts/:id" element={<SellerDiscountDetailPage />} />
              <Route path="promo-codes" element={<SellerPromoCodesPage />} />
        <Route path="promo-codes/:id" element={<SellerPromoDetailPage />} />
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
