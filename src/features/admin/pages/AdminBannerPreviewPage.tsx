import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AdminNavbar } from '../components/AdminNavbar';
import { useAdminBanners } from '@shared/hooks/useAdminBanners';
import { getBannerDisplay } from '../data/adminBannerStaticData';

type Tab = 'details' | 'preview';

export function AdminBannerPreviewPage() {
  const { id } = useParams();
  const [tab, setTab] = useState<Tab>('preview');
  const { data, isLoading } = useAdminBanners({ limit: 100 });
  const banner = data?.banners?.find((b) => b._id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center"><p className="text-ink-faint">Loading...</p></div>
      </div>
    );
  }
  if (!banner) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-ink" style={{ fontSize: '18px', fontWeight: 600 }}>Banner not found</p>
            <Link to="/admin/content" className="text-brand hover:underline">← Back to Content</Link>
          </div>
        </div>
      </div>
    );
  }

  const display = getBannerDisplay(banner);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <div className="flex flex-col" style={{ padding: '32px', gap: '24px', maxWidth: '900px' }}>
        <Link to="/admin/content" className="flex items-center text-ink-secondary hover:text-ink no-underline" style={{ gap: '8px', fontSize: '16px' }}>
          <ArrowLeft className="w-5 h-5" /> Back to Content
        </Link>

        <div className="flex items-center justify-between">
          <nav className="flex items-center text-ink-faint" style={{ gap: '8px', fontSize: '14px' }}>
            <span>Content</span><span>/</span><span className="text-ink font-medium">Preview</span>
          </nav>
          <div className="flex items-center" style={{ gap: '4px', borderBottom: '1px solid var(--color-line)' }}>
            <button onClick={() => setTab('details')} className={tab === 'details' ? 'text-ink font-medium' : 'text-ink-faint'} style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, borderBottom: tab === 'details' ? '2px solid var(--color-ink)' : '2px solid transparent', marginBottom: '-1px' }}>Banner Details</button>
            <button onClick={() => setTab('preview')} className={tab === 'preview' ? 'text-ink font-medium' : 'text-ink-faint'} style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, borderBottom: tab === 'preview' ? '2px solid var(--color-ink)' : '2px solid transparent', marginBottom: '-1px' }}>Preview</button>
          </div>
        </div>

        {tab === 'preview' ? (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', overflow: 'hidden' }}>
            <div className="relative" style={{ minHeight: '300px', background: 'var(--color-primary-light)' }}>
              {banner.image && <img src={banner.image} alt={banner.title} className="w-full object-cover" style={{ minHeight: '300px' }} />}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ padding: '32px' }}>
                <h2 className="font-bold text-ink" style={{ fontSize: '28px' }}>{banner.title}</h2>
                <p className="text-ink-secondary" style={{ fontSize: '16px', marginTop: '8px', maxWidth: '500px' }}>{display.description}</p>
                <button className="bg-ink text-white mt-4" style={{ borderRadius: 'var(--radius-pill)', padding: '12px 32px', fontSize: '16px', fontWeight: 500 }}>{display.buttonText}</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white" style={{ border: '1px solid var(--color-line)', borderRadius: '8px', padding: '24px' }}>
            <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Banner Information</h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              <DetailRow label="Title" value={banner.title} />
              <DetailRow label="Description" value={display.description} />
              <DetailRow label="Placement" value={display.placement} />
              <DetailRow label="Button Text" value={display.buttonText} />
              <DetailRow label="Link" value={banner.link} />
              <DetailRow label="Sort Order" value={String(banner.sortOrder)} />
            </div>
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-line)' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Status & Schedule</h3>
              <div className="flex flex-col" style={{ gap: '16px' }}>
                <DetailRow label="Status" value={banner.isActive ? 'Active' : 'Inactive'} />
                <DetailRow label="Start Date" value={display.startDate} />
                <DetailRow label="End Date" value={display.endDate} />
              </div>
            </div>
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-line)' }}>
              <h3 className="font-bold text-ink" style={{ fontSize: '16px', marginBottom: '16px' }}>Image Details</h3>
              <div className="flex flex-col" style={{ gap: '16px' }}>
                <DetailRow label="Filename" value={display.imageFilename} />
                <DetailRow label="Dimensions" value={display.imageDimensions} />
                <DetailRow label="Format" value={display.imageFormat} />
                <DetailRow label="Size" value={display.imageSize} />
              </div>
              {banner.image && <img src={banner.image} alt={banner.title} className="rounded-card-sm mt-4" style={{ maxWidth: '200px' }} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-secondary" style={{ fontSize: '14px' }}>{label}</span>
      <span className="text-ink font-medium" style={{ fontSize: '14px' }}>{value}</span>
    </div>
  );
}