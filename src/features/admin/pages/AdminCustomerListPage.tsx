import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Trash2, MoreVertical } from "lucide-react";
import { AdminNavbar } from "../components/AdminNavbar";
import { useAdminUsers } from "@shared/hooks/useAdminUsers";
import { useDeleteUser } from "@shared/hooks/useDeleteUser";
import { useToast } from "@/shared/ui";
import { formatDate } from "@shared/lib/utils";
import type {
  AdminUser,
  GetAdminUsersParams,
} from "@shared/hooks/useAdminUsers";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  Active: {
    bg: "var(--color-status-delivered-bg)",
    text: "var(--color-success-text)",
  },
  Blocked: { bg: "var(--color-status-out-of-stock-bg)", text: "#171315" },
};

const FILTERS = ["All", "Active", "Blocked"];

export function AdminCustomerListPage() {
  const toast = useToast();
  const deleteUser = useDeleteUser();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const queryParams: any = { role: "customer", page, limit: 10 };
  if (filter === "Active") queryParams.isActive = true;
  if (filter === "Blocked") queryParams.isActive = false;
  if (search.trim()) queryParams.search = search.trim();

  const { data, isLoading } = useAdminUsers(queryParams);
  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  function handleDelete(u: AdminUser) {
    if (!confirm(`Delete "${u.name}"? This will soft-delete the account.`))
      return;
    deleteUser.mutate(
      { userId: u._id },
      {
        onSuccess: () => toast.success(`"${u.name}" deleted`),
        onError: (err: any) => toast.error(err?.message ?? "Failed to delete"),
      },
    );
    setOpenMenu(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: "32px", gap: "24px" }}>
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-ink" style={{ fontSize: "20px" }}>
            Customers
          </h1>
          <Link
            to="/admin/customers/new"
            className="flex items-center bg-ink text-white no-underline"
            style={{
              borderRadius: "var(--radius-pill)",
              padding: "8px 16px",
              gap: "8px",
              fontSize: "18px",
              fontWeight: 500,
              height: "48px",
            }}
          >
            <Plus className="w-5 h-5" /> Add Customer
          </Link>
        </div>

        {/* Stat cards */}
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}
        >
          <div
            className="bg-white"
            style={{ borderRadius: "8px", padding: "20px" }}
          >
            <span className="text-ink-secondary" style={{ fontSize: "14px" }}>
              Total Customers
            </span>
            <div className="flex items-center" style={{ gap: "6px" }}>
              <span className="font-bold text-ink" style={{ fontSize: "24px" }}>
                24,815
              </span>
              <span className="text-success-text" style={{ fontSize: "12px" }}>
                ↑18.4%
              </span>
            </div>
          </div>
          <div
            className="bg-white"
            style={{ borderRadius: "8px", padding: "20px" }}
          >
            <span className="text-ink-secondary" style={{ fontSize: "14px" }}>
              Active
            </span>
            <div className="font-bold text-ink" style={{ fontSize: "24px" }}>
              22,410
            </div>
          </div>
          <div
            className="bg-white"
            style={{ borderRadius: "8px", padding: "20px" }}
          >
            <span className="text-ink-secondary" style={{ fontSize: "14px" }}>
              New This Month
            </span>
            <div className="font-bold text-ink" style={{ fontSize: "24px" }}>
              1,240
            </div>
          </div>
          <div
            className="bg-white"
            style={{ borderRadius: "8px", padding: "20px" }}
          >
            <span className="text-ink-secondary" style={{ fontSize: "14px" }}>
              Blocked
            </span>
            <div className="font-bold text-ink" style={{ fontSize: "24px" }}>
              165
            </div>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center overflow-hidden"
            style={{
              minWidth: "300px",
              height: "40px",
              border: "1px solid var(--color-line)",
              borderRadius: "8px",
            }}
          >
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email..."
              className="flex-1 h-full bg-transparent px-4 text-body2 focus:outline-none"
            />
          </div>
          <div className="flex items-center" style={{ gap: "6px" }}>
            {FILTERS.map((f, i) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={
                  filter === f ? "bg-ink text-white" : "text-ink-secondary"
                }
                style={{
                  borderRadius: "var(--radius-pill)",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: 500,
                  border: filter === f ? "none" : "1px solid var(--color-line)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
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
            <p className="text-ink-faint">Loading customers...</p>
          </div>
        ) : users.length === 0 ? (
          <div
            className="bg-white"
            style={{
              border: "1px solid var(--color-line)",
              borderRadius: "8px",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <p
              className="text-ink"
              style={{ fontSize: "18px", fontWeight: 600 }}
            >
              No customers found
            </p>
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
                    Name
                  </th>
                  <th
                    className="text-left font-bold text-ink-secondary"
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Email
                  </th>
                  <th
                    className="text-left font-bold text-ink-secondary"
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Phone
                  </th>
                  <th
                    className="text-left font-bold text-ink-secondary"
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Registered
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
                  <th
                    className="text-center font-bold text-ink-secondary"
                    style={{
                      padding: "12px 16px",
                      fontSize: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const st =
                    STATUS_STYLES[u.isActive ? "Active" : "Blocked"] ??
                    STATUS_STYLES.Active;
                  return (
                    <tr
                      key={u._id}
                      style={{ borderBottom: "1px solid var(--color-line)" }}
                      className="hover:bg-surface transition-colors"
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <Link
                          to={`/admin/customers/${u._id}`}
                          className="text-ink font-medium no-underline"
                          style={{ fontSize: "14px" }}
                        >
                          {u.name}
                        </Link>
                      </td>
                      <td
                        className="text-ink-faint"
                        style={{ padding: "12px 16px", fontSize: "14px" }}
                      >
                        {u.email}
                      </td>
                      <td
                        className="text-ink-faint"
                        style={{ padding: "12px 16px", fontSize: "14px" }}
                      >
                        {u.phone || "—"}
                      </td>
                      <td
                        className="text-ink-faint"
                        style={{ padding: "12px 16px", fontSize: "14px" }}
                      >
                        {formatDate(u.createdAt)}
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
                          {u.isActive ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          textAlign: "center",
                          position: "relative",
                        }}
                      >
                        <button
                          onClick={() =>
                            setOpenMenu(openMenu === u._id ? null : u._id)
                          }
                          className="text-ink-faint hover:text-ink"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenu === u._id && (
                          <div
                            className="absolute bg-white shadow-lg z-50"
                            style={{
                              right: "16px",
                              top: "48px",
                              border: "1px solid var(--color-line)",
                              borderRadius: "8px",
                              padding: "4px",
                              minWidth: "120px",
                            }}
                          >
                            <Link
                              to={`/admin/customers/${u._id}`}
                              onClick={() => setOpenMenu(null)}
                              className="flex items-center text-ink hover:bg-surface no-underline"
                              style={{
                                padding: "8px 12px",
                                gap: "8px",
                                fontSize: "14px",
                                borderRadius: "4px",
                              }}
                            >
                              <Eye className="w-4 h-4" /> View
                            </Link>
                            <button
                              onClick={() => handleDelete(u)}
                              className="flex items-center text-danger-dark hover:bg-danger-dark/5 w-full"
                              style={{
                                padding: "8px 12px",
                                gap: "8px",
                                fontSize: "14px",
                                borderRadius: "4px",
                              }}
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-ink-faint" style={{ fontSize: "14px" }}>
              Showing {(page - 1) * 10 + 1}-{Math.min(page * 10, total)} of{" "}
              {total}
            </span>
            <div className="flex items-center" style={{ gap: "4px" }}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="text-ink-faint"
                style={{
                  border: "1px solid var(--color-line)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  fontSize: "14px",
                }}
              >
                Prev
              </button>
              <span
                className="bg-ink text-white"
                style={{
                  borderRadius: "8px",
                  padding: "6px 12px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {page}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="text-ink-faint"
                style={{
                  border: "1px solid var(--color-line)",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  fontSize: "14px",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
