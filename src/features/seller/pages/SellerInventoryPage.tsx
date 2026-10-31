import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, AlertTriangle, Boxes, TrendingDown } from "lucide-react";
import { SellerNavbar } from "../components/SellerNavbar";
import { useProducts } from "@shared/hooks/useProducts";
import { useAuth } from "@shared/lib/useAuth";
import { useUpdateProduct } from "@shared/hooks/useUpdateProduct";
import { useToast } from "@/shared/ui";
import { formatCurrency } from "@shared/lib/utils";
import type { Product } from "@shared/types";

type StockStatus = "in-stock" | "low-stock" | "critical" | "out-of-stock";

function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return "out-of-stock";
  if (stock <= 5) return "critical";
  if (stock <= 15) return "low-stock";
  return "in-stock";
}

const STATUS_CONFIG: Record<
  StockStatus,
  { label: string; bg: string; text: string }
> = {
  "in-stock": {
    label: "In Stock",
    bg: "var(--color-status-delivered-bg)",
    text: "var(--color-success-text)",
  },
  "low-stock": {
    label: "Low Stock",
    bg: "var(--color-status-pending-bg)",
    text: "var(--color-warning-text)",
  },
  critical: {
    label: "Critical",
    bg: "var(--color-status-shipped-bg)",
    text: "var(--color-danger-dark)",
  },
  "out-of-stock": {
    label: "Out of Stock",
    bg: "var(--color-status-out-of-stock-bg)",
    text: "#171315",
  },
};

const FILTER_TABS: { label: string; value: "all" | StockStatus }[] = [
  { label: "All Products", value: "all" },
  { label: "Low Stock", value: "low-stock" },
  { label: "Critical", value: "critical" },
  { label: "Out of Stock", value: "out-of-stock" },
];

export function SellerInventoryPage() {
  const { user } = useAuth();
  const toast = useToast();
  const updateProduct = useUpdateProduct();
  const [activeFilter, setActiveFilter] = useState<"all" | StockStatus>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const { data, isLoading } = useProducts({ sort: "newest", limit: 100 });

  const sellerId = user?.id;
  const allProducts = (data?.products ?? []).filter(
    (p) => typeof p.seller === "object" && p.seller._id === sellerId,
  );

  const totalStock = allProducts.reduce((sum, p) => sum + p.stock, 0);
  const alertsCount = allProducts.filter((p) => p.stock <= 15).length;
  const outOfStockCount = allProducts.filter((p) => p.stock === 0).length;

  const statusCounts = {
    all: allProducts.length,
    "in-stock": allProducts.filter(
      (p) => getStockStatus(p.stock) === "in-stock",
    ).length,
    "low-stock": allProducts.filter(
      (p) => getStockStatus(p.stock) === "low-stock",
    ).length,
    critical: allProducts.filter((p) => getStockStatus(p.stock) === "critical")
      .length,
    "out-of-stock": allProducts.filter(
      (p) => getStockStatus(p.stock) === "out-of-stock",
    ).length,
  };

  const filtered =
    activeFilter === "all"
      ? allProducts
      : allProducts.filter((p) => getStockStatus(p.stock) === activeFilter);

  function startEdit(p: Product) {
    setEditingId(p._id);
    setEditValue(String(p.stock));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function saveEdit(productId: string) {
    const newStock = parseInt(editValue, 10);
    if (isNaN(newStock) || newStock < 0) {
      toast.error("Please enter a valid stock number.");
      return;
    }
    try {
      await updateProduct.mutateAsync({ productId, stock: newStock });
      toast.success("Stock updated");
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error?.message ?? "Failed to update stock");
    }
    cancelEdit();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: "32px", gap: "24px" }}>
        <h1 className="font-bold text-ink" style={{ fontSize: "20px" }}>
          Inventory
        </h1>

        {/* Stat cards */}
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}
        >
          <StatCard
            icon={Boxes}
            label="Total Stock"
            value={String(totalStock)}
            subtitle="across all products"
          />
          <StatCard
            icon={Package}
            label="Available to Sell"
            value={String(totalStock)}
            subtitle="no reservations"
          />
          <StatCard
            icon={TrendingDown}
            label="Stock Alerts"
            value={String(alertsCount)}
            subtitle={`${outOfStockCount} out of stock`}
            alert={alertsCount > 0}
          />
          <StatCard
            icon={AlertTriangle}
            label="Out of Stock"
            value={String(outOfStockCount)}
            subtitle="products"
            alert={outOfStockCount > 0}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center" style={{ gap: "8px" }}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={
                activeFilter === tab.value
                  ? "bg-ink text-white"
                  : "text-ink-secondary"
              }
              style={{
                borderRadius: "var(--radius-pill)",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: 500,
                border:
                  activeFilter === tab.value
                    ? "none"
                    : "1px solid var(--color-line)",
              }}
            >
              {tab.label}
              <span
                style={{ marginLeft: "6px", opacity: 0.7, fontSize: "12px" }}
              >
                ({statusCounts[tab.value]})
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        {isLoading ? (
          <div
            className="bg-white"
            style={{
              border: "1px solid var(--color-line)",
              borderRadius: "8px",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <p className="text-ink-faint">Loading inventory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="bg-white"
            style={{
              border: "1px solid var(--color-line)",
              borderRadius: "8px",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <Boxes className="w-12 h-12 text-ink-faint mx-auto mb-3" />
            <p
              className="text-ink"
              style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}
            >
              {activeFilter === "all"
                ? "No products in inventory"
                : `No ${activeFilter.replace("-", " ")} products`}
            </p>
            {activeFilter === "all" && (
              <Link
                to="/seller/products/new"
                className="inline-flex items-center bg-ink text-white no-underline"
                style={{
                  borderRadius: "var(--radius-pill)",
                  padding: "8px 16px",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                Add Product
              </Link>
            )}
          </div>
        ) : (
          <div
            className="bg-white overflow-hidden"
            style={{
              border: "1px solid var(--color-line)",
              borderRadius: "8px",
            }}
          >
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--color-line)",
                    background: "#FFF9F9",
                  }}
                >
                  <th
                    className="text-left font-bold text-ink-secondary"
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Product
                  </th>
                  <th
                    className="text-left font-bold text-ink-secondary"
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Category
                  </th>
                  <th
                    className="text-center font-bold text-ink-secondary"
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Stock
                  </th>
                  <th
                    className="text-right font-bold text-ink-secondary"
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Price
                  </th>
                  <th
                    className="text-center font-bold text-ink-secondary"
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const status = getStockStatus(p.stock);
                  const st = STATUS_CONFIG[status];
                  const isEditing = editingId === p._id;
                  return (
                    <tr
                      key={p._id}
                      style={{ borderBottom: "1px solid var(--color-line)" }}
                      className="hover:bg-surface transition-colors"
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <Link
                          to={`/seller/products/${p._id}`}
                          className="flex items-center no-underline"
                          style={{ gap: "12px" }}
                        >
                          <div
                            className="rounded-card-sm bg-primary-light shrink-0 overflow-hidden"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {p.images?.[0] && (
                              <img
                                src={p.images[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span
                            className="text-ink font-medium"
                            style={{ fontSize: "14px" }}
                          >
                            {p.name}
                          </span>
                        </Link>
                      </td>
                      <td
                        className="text-ink-faint"
                        style={{ padding: "12px 16px", fontSize: "14px" }}
                      >
                        {p.category?.name ?? "—"}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        {isEditing ? (
                          <div
                            className="flex items-center justify-center"
                            style={{ gap: "4px" }}
                          >
                            <input
                              type="number"
                              min="0"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit(p._id);
                                if (e.key === "Escape") cancelEdit();
                              }}
                              autoFocus
                              className="bg-white text-ink text-center"
                              style={{
                                border: "1px solid var(--color-brand)",
                                borderRadius: "6px",
                                padding: "4px 8px",
                                fontSize: "14px",
                                width: "70px",
                              }}
                            />
                            <button
                              onClick={() => saveEdit(p._id)}
                              disabled={updateProduct.isPending}
                              className="bg-ink text-white"
                              style={{
                                borderRadius: "6px",
                                padding: "4px 8px",
                                fontSize: "12px",
                                fontWeight: 500,
                                opacity: updateProduct.isPending ? 0.6 : 1,
                              }}
                            >
                              {updateProduct.isPending ? "..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-ink-faint hover:text-ink"
                              style={{ fontSize: "12px" }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(p)}
                            className="text-ink font-medium hover:text-brand transition-colors"
                            style={{
                              fontSize: "14px",
                              cursor: "pointer",
                              background: "none",
                              border: "none",
                            }}
                            title="Click to edit stock"
                          >
                            {p.stock}
                          </button>
                        )}
                      </td>
                      <td
                        className="text-right font-bold text-ink"
                        style={{ padding: "12px 16px", fontSize: "14px" }}
                      >
                        {formatCurrency(p.price)}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <span
                          className="inline-flex items-center justify-center"
                          style={{
                            background: st.bg,
                            color: st.text,
                            borderRadius: "6px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                        >
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <p
            className="text-ink-faint"
            style={{ fontSize: "12px", textAlign: "center" }}
          >
            Click any stock number to edit it inline. Press Enter to save,
            Escape to cancel.
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  alert,
}: {
  icon: typeof Boxes;
  label: string;
  value: string;
  subtitle: string;
  alert?: boolean;
}) {
  return (
    <div
      className="bg-white"
      style={{
        borderRadius: "8px",
        padding: "24px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-ink-secondary"
          style={{ fontSize: "14px", lineHeight: "20px" }}
        >
          {label}
        </span>
        <Icon
          className="w-4 h-4"
          style={{
            color: alert
              ? "var(--color-danger-dark)"
              : "var(--color-ink-faint)",
          }}
        />
      </div>
      <span
        className="font-bold"
        style={{
          fontSize: "20px",
          lineHeight: "24px",
          color: alert ? "var(--color-danger-dark)" : "var(--color-ink)",
        }}
      >
        {value}
      </span>
      <span
        className="text-ink-faint"
        style={{ fontSize: "12px", lineHeight: "16px" }}
      >
        {subtitle}
      </span>
    </div>
  );
}
