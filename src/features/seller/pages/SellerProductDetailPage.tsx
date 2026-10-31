import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Package } from 'lucide-react';
import { SellerNavbar } from '../components/SellerNavbar';
import { useProduct } from '@shared/hooks/useProduct';
import { formatCurrency, formatDate } from '@shared/lib/utils';

const PRODUCT_META_KEY = 'elara_product_meta';

export function SellerProductDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useProduct(id);
  const product = data?.product;

  let brand = '';
  let ingredients = '';
  if (id) {
    try {
      const raw = localStorage.getItem(`${PRODUCT_META_KEY}_${id}`);
      if (raw) {
        const meta = JSON.parse(raw);
        brand = meta.brand ?? '';
        ingredients = meta.ingredients ?? '';
      }
    } catch { /* ignore */ }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SellerNavbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-ink-faint">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <SellerNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-ink" style={{ fontSize: '18px', fontWeight: 600 }}>Product not found</p>
            <Link to="/seller/products" className="text-brand hover:underline">← Back to products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SellerNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px' }}>
        <div className="flex items-center justify-between">
          <Link to="/seller/products" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px' }}>
            <ArrowLeft className="w-5 h-5" /> Back to Products
          </Link>
          <Link to={`/seller/products/${product._id}/edit`} className="flex items-center bg-ink text-white no-underline"
            style={{ borderRadius: 'var(--radius-pill)', padding: '8px 16px', gap: '8px', fontSize: '16px', fontWeight: 500, height: '40px' }}>
            <Pencil className="w-4 h-4" /> Edit Product
          </Link>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '400px 1fr', gap: '32px' }}>
          {/* Image gallery */}
          <div className="flex flex-col" style={{ gap: '12px' }}>
            <div className="bg-white rounded-card-sm overflow-hidden flex items-center justify-center" style={{ border: '1px solid var(--color-line)', height: '300px' }}>
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-16 h-16 text-ink-faint" />
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex flex-wrap" style={{ gap: '8px' }}>
                {product.images.slice(1).map((img, i) => (
                  <div key={i} className="bg-white rounded-card-sm overflow-hidden" style={{ border: '1px solid var(--color-line)', width: '60px', height: '60px' }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col" style={{ gap: '24px' }}>
            <div>
              <h1 className="font-bold text-ink" style={{ fontSize: '24px' }}>{product.name}</h1>
              <div className="flex items-center" style={{ gap: '12px', marginTop: '8px' }}>
                <span className="font-bold text-ink" style={{ fontSize: '28px' }}>{formatCurrency(product.price)}</span>
                <span className="inline-flex items-center justify-center" style={{
                  background: product.isActive ? 'var(--color-status-delivered-bg)' : 'var(--color-status-out-of-stock-bg)',
                  color: product.isActive ? 'var(--color-success-text)' : '#171315',
                  borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 500,
                }}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '8px' }}>Description</h3>
                <p className="text-ink-secondary" style={{ fontSize: '14px', lineHeight: '22px' }}>{product.description}</p>
              </div>
            )}

            <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Product Details</h3>
              <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                <DetailRow label="Category" value={typeof product.category === 'object' ? product.category.name : '—'} />
                <DetailRow label="Brand" value={brand || '—'} />
                <DetailRow label="Stock" value={String(product.stock)} />
                <DetailRow label="Date Added" value={formatDate(product.createdAt)} />
                <DetailRow label="Seller" value={typeof product.seller === 'object' ? product.seller.name : '—'} />
                <DetailRow label="Status" value={product.isActive ? 'Active' : 'Inactive'} />
              </div>
            </div>

            {ingredients && (
              <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
                <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '8px' }}>Ingredients</h3>
                <p className="text-ink-secondary" style={{ fontSize: '14px', lineHeight: '22px' }}>{ingredients}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col" style={{ gap: '4px' }}>
      <span className="text-ink-faint" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <span className="text-ink" style={{ fontSize: '14px' }}>{value}</span>
    </div>
  );
}