export default function Dashboard() {
    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Genel Bakış</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Toplam Dolap</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0', color: 'var(--primary)' }}>8</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Toplam Ürün</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0', color: 'var(--primary)' }}>245</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Kritik Stok</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0', color: '#ef4444' }}>3</p>
                </div>
            </div>
        </div>
    );
}
