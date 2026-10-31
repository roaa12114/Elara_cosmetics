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
import { SellerProductsPage } from "@features/seller/pages/SellerProductsPage";
import { SellerAddProductPage } from "@features/seller/pages/SellerAddProductPage";
import { SellerEditProductPage } from "@features/seller/pages/SellerEditProductPage";
import { SellerProductDetailPage } from "@features/seller/pages/SellerProductDetailPage";
import { SellerInventoryPage } from "@features/seller/pages/SellerInventoryPage";
import { SellerOrdersPage } from "@features/seller/pages/SellerOrdersPage";
import { SellerOrderDetailPage } from "@features/seller/pages/SellerOrderDetailPage";
import { SellerEarningsPage } from "@features/seller/pages/SellerEarningsPage";
import { SellerPayoutsPage } from "@features/seller/pages/SellerPayoutsPage";
import { SellerPromotionsPage } from "@features/seller/pages/SellerPromotionsPage";
import { SellerSettingsPage } from "@features/seller/pages/SellerSettingsPage";
import { SellerDiscountsPage } from "@features/seller/pages/SellerDiscountsPage";
import { SellerDiscountDetailPage } from "@features/seller/pages/SellerDiscountDetailPage";
import { SellerPromoCodesPage } from "@features/seller/pages/SellerPromoCodesPage";
import { SellerPromoDetailPage } from "@features/seller/pages/SellerPromoDetailPage";
import { AdminDashboardPage } from "@features/admin/pages/AdminDashboardPage";
import { AdminCustomerListPage } from "@features/admin/pages/AdminCustomerListPage";
import { AdminAddCustomerPage } from "@features/admin/pages/AdminAddCustomerPage";
import { AdminCustomerDetailPage } from "@features/admin/pages/AdminCustomerDetailPage";
import { AdminEditCustomerPage } from "@features/admin/pages/AdminEditCustomerPage";
import { AdminBlockCustomerPage } from "@features/admin/pages/AdminBlockCustomerPage";
import { AdminUnblockCustomerPage } from "@features/admin/pages/AdminUnblockCustomerPage";
import { AdminApproveCustomerPage } from "@features/admin/pages/AdminApproveCustomerPage";
import { AdminRejectCustomerPage } from "@features/admin/pages/AdminRejectCustomerPage";
import { AdminApprovedSuccessPage } from "@features/admin/pages/AdminApprovedSuccessPage";
import { AdminRejectedSuccessPage } from "@features/admin/pages/AdminRejectedSuccessPage";
import { AdminOrderDetailPage } from "@features/admin/pages/AdminOrderDetailPage";
import { NotFoundPage } from "@pages/NotFoundPage";
import { DevShowcasePage } from "@pages/DevShowcasePage";
import { BrandsPage } from "@features/customer/pages/BrandsPage";
import { BrandDetailPage } from "@features/customer/pages/BrandDetailPage";
import { ProductDetailPage } from "@features/customer/pages/ProductDetailPage";
import { BundlesPage } from "@features/customer/pages/BundlesPage";
import { BundleDetailPage } from "@features/customer/pages/BundleDetailPage";
import { OffersPage } from "@features/customer/pages/OffersPage";
import { AdminSellerListPage } from "@features/admin/pages/AdminSellerListPage";
import { AdminAddSellerPage } from "@features/admin/pages/AdminAddSellerPage";
import { AdminSellerDetailPage } from "@features/admin/pages/AdminSellerDetailPage";
import { AdminEditSellerPage } from "@features/admin/pages/AdminEditSellerPage";
import { AdminSellerApplicationPage } from "@features/admin/pages/AdminSellerApplicationPage";
import { AdminSellerApprovePage } from "@features/admin/pages/AdminSellerApprovePage";
import { AdminSellerApprovedSuccessPage } from "@features/admin/pages/AdminSellerApprovedSuccessPage";
import { AdminSellerRejectPage } from "@features/admin/pages/AdminSellerRejectPage";
import { AdminSellerRejectedSuccessPage } from "@features/admin/pages/AdminSellerRejectedSuccessPage";
import { AdminSellerBlockPage } from "@features/admin/pages/AdminSellerBlockPage";
import { AdminSellerBlockedSuccessPage } from "@features/admin/pages/AdminSellerBlockedSuccessPage";
import { AdminSellerUnblockPage } from "@features/admin/pages/AdminSellerUnblockPage";
import { AdminSellerUnblockedSuccessPage } from "@features/admin/pages/AdminSellerUnblockedSuccessPage";
import { AdminCategoryListPage } from "@features/admin/pages/AdminCategoryListPage";
import { AdminAddCategoryPage } from "@features/admin/pages/AdminAddCategoryPage";
import { AdminEditCategoryPage } from "@features/admin/pages/AdminEditCategoryPage";
import { AdminCategorySubcategoriesPage } from "@features/admin/pages/AdminCategorySubcategoriesPage";
import { AdminOrderListPage } from "@features/admin/pages/AdminOrderListPage";
import { AdminOrderUpdateStatusPage } from "@features/admin/pages/AdminOrderUpdateStatusPage";
import { AdminDiscountListPage } from "@features/admin/pages/AdminDiscountListPage";
import { AdminCreateDiscountPage } from "@features/admin/pages/AdminCreateDiscountPage";
import { AdminDiscountCreatedSuccessPage } from "@features/admin/pages/AdminDiscountCreatedSuccessPage";
import { AdminShippingPage } from "@features/admin/pages/AdminShippingPage";
import { AdminContentListPage } from "@features/admin/pages/AdminContentListPage";
import { AdminAddBannerPage } from "@features/admin/pages/AdminAddBannerPage";
import { AdminBannerPreviewPage } from "@features/admin/pages/AdminBannerPreviewPage";
import { AdminAnalyticsPage } from "@features/admin/pages/AdminAnalyticsPage";
import { AdminSettingsPage } from "@features/admin/pages/AdminSettingsPage";
import { AdminSettingsProfilePage } from "@features/admin/pages/AdminSettingsProfilePage";
import { AdminSettingsNotificationsPage } from "@features/admin/pages/AdminSettingsNotificationsPage";
import { AdminSettingsStorePage } from "@features/admin/pages/AdminSettingsStorePage";
import { AdminSettingsPaymentPage } from "@features/admin/pages/AdminSettingsPaymentPage";
import { AdminSettingsShippingPage } from "@features/admin/pages/AdminSettingsShippingPage";
import { AdminSettingsSecurityPage } from "@features/admin/pages/AdminSettingsSecurityPage";
import { AdminSettingsTeamPage } from "@features/admin/pages/AdminSettingsTeamPage";

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
        <Route index element={<SellerDashboardPage />} />
        <Route path="products" element={<SellerProductsPage />} />
        <Route path="products/new" element={<SellerAddProductPage />} />
        <Route path="products/:id" element={<SellerProductDetailPage />} />
        <Route path="products/:id/edit" element={<SellerEditProductPage />} />
        <Route path="inventory" element={<SellerInventoryPage />} />
        <Route path="orders" element={<SellerOrdersPage />} />
        <Route path="orders/:id" element={<SellerOrderDetailPage />} />
        <Route path="earnings" element={<SellerEarningsPage />} />
        <Route path="payouts" element={<SellerPayoutsPage />} />
        <Route path="promotions" element={<SellerPromotionsPage />} />
        <Route path="discounts" element={<SellerDiscountsPage />} />
        <Route path="discounts/:id" element={<SellerDiscountDetailPage />} />
        <Route path="promo-codes" element={<SellerPromoCodesPage />} />
        <Route path="promo-codes/:id" element={<SellerPromoDetailPage />} />
        <Route path="settings" element={<SellerSettingsPage />} />
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
        <Route path="customers" element={<AdminCustomerListPage />} />
        <Route path="customers/new" element={<AdminAddCustomerPage />} />
        <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
        <Route path="customers/:id/edit" element={<AdminEditCustomerPage />} />
        <Route
          path="customers/:id/block"
          element={<AdminBlockCustomerPage />}
        />
        <Route
          path="customers/:id/unblock"
          element={<AdminUnblockCustomerPage />}
        />
        <Route
          path="customers/:id/approve"
          element={<AdminApproveCustomerPage />}
        />
        <Route
          path="customers/:id/reject"
          element={<AdminRejectCustomerPage />}
        />
        <Route
          path="customers/:id/approved"
          element={<AdminApprovedSuccessPage />}
        />
        <Route
          path="customers/:id/rejected"
          element={<AdminRejectedSuccessPage />}
        />
        <Route
          path="customers/:id/orders/:orderId"
          element={<AdminOrderDetailPage />}
        />
        {/*Seller*/}
        <Route path="sellers" element={<AdminSellerListPage />} />
        <Route path="sellers/new" element={<AdminAddSellerPage />} />
        <Route path="sellers/:id" element={<AdminSellerDetailPage />} />
        <Route path="sellers/:id/edit" element={<AdminEditSellerPage />} />
        <Route
          path="sellers/:id/application"
          element={<AdminSellerApplicationPage />}
        />
        <Route
          path="sellers/:id/approve"
          element={<AdminSellerApprovePage />}
        />
        <Route
          path="sellers/:id/approved"
          element={<AdminSellerApprovedSuccessPage />}
        />
        <Route path="sellers/:id/reject" element={<AdminSellerRejectPage />} />
        <Route
          path="sellers/:id/rejected"
          element={<AdminSellerRejectedSuccessPage />}
        />
        <Route path="sellers/:id/block" element={<AdminSellerBlockPage />} />
        <Route
          path="sellers/:id/blocked"
          element={<AdminSellerBlockedSuccessPage />}
        />
        <Route
          path="sellers/:id/unblock"
          element={<AdminSellerUnblockPage />}
        />
        <Route
          path="sellers/:id/unblocked"
          element={<AdminSellerUnblockedSuccessPage />}
        />
        {/* category*/}
        <Route path="categories" element={<AdminCategoryListPage />} />
        <Route path="categories/new" element={<AdminAddCategoryPage />} />
        <Route path="categories/:id/edit" element={<AdminEditCategoryPage />} />
        <Route
          path="categories/:id/subcategories"
          element={<AdminCategorySubcategoriesPage />}
        />
        {/* Order  */}
        <Route path="orders" element={<AdminOrderListPage />} />
        <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
        <Route
          path="orders/:orderId/status"
          element={<AdminOrderUpdateStatusPage />}
        />
        {/* Discount  */}
        <Route path="discounts" element={<AdminDiscountListPage />} />
        <Route path="discounts/new" element={<AdminCreateDiscountPage />} />
        <Route
          path="discounts/:code/created"
          element={<AdminDiscountCreatedSuccessPage />}
        />
        {/* Shipping routes */}
        <Route path="shipping" element={<AdminShippingPage />} />
        {/* Content routes */}
        <Route path="content" element={<AdminContentListPage />} />
        <Route path="content/new" element={<AdminAddBannerPage />} />
        <Route path="content/:id" element={<AdminBannerPreviewPage />} />
        {/* Analytics routes */}
        <Route path="analytics" element={<AdminAnalyticsPage />} />
      {/* Settings routes */}
<Route path="settings" element={<AdminSettingsPage />} />
<Route path="settings/profile" element={<AdminSettingsProfilePage />} />
<Route path="settings/notifications" element={<AdminSettingsNotificationsPage />} />
<Route path="settings/store" element={<AdminSettingsStorePage />} />
<Route path="settings/payment" element={<AdminSettingsPaymentPage />} />
<Route path="settings/shipping" element={<AdminSettingsShippingPage />} />
<Route path="settings/security" element={<AdminSettingsSecurityPage />} />
<Route path="settings/team-members" element={<AdminSettingsTeamPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
