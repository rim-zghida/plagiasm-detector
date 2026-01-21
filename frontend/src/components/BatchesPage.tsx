import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Batch = {
  id: string;
  status: string;
  analysis_type: string;
  total_docs: number;
  processed_docs: number;
  ai_provider: string;
  ai_threshold: number;
  created_at: string | null;
};

const BatchesPage = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/batches', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch batches');
        const data = await response.json();
        setBatches(data.data || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatches();
  }, []);

  return (
    <div className="container fade-in" style={{ padding: '60px 0' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '12px' }}>
          Your Batches
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Open a batch to view detailed results and export reports.
        </p>
      </div>

      {isLoading && <p>Loading batches...</p>}
      {error && <p style={{ color: 'var(--error)' }}>Error: {error}</p>}

      {!isLoading && !error && batches.length === 0 && (
        <div className="glass" style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ marginBottom: '16px' }}>No batches yet.</p>
          <Link to="/upload" className="btn-primary" style={{ textDecoration: 'none' }}>
            Upload Documents
          </Link>
        </div>
      )}

      {batches.length > 0 && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {batches.map((batch) => {
            const created = batch.created_at
              ? new Date(batch.created_at).toLocaleString()
              : 'Unknown';
            const progress = batch.total_docs
              ? Math.round((batch.processed_docs / batch.total_docs) * 100)
              : 0;

            return (
              <Link
                key={batch.id}
                to={`/batch/${batch.id}`}
                className="glass card-hover"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: '24px',
                  borderRadius: '16px',
                  display: 'grid',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ fontWeight: 700 }}>Batch {batch.id}</div>
                  <span style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    background: batch.status === 'completed'
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(245, 158, 11, 0.2)',
                    color: batch.status === 'completed' ? '#10b981' : '#f59e0b',
                  }}>
                    {batch.status}
                  </span>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {batch.processed_docs}/{batch.total_docs} documents • {progress}% complete
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Mode: {batch.analysis_type} • Provider: {batch.ai_provider}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                  Created: {created}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BatchesPage;
