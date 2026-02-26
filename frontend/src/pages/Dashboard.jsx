export default function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-main">Genel Bakış</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Toplam Dolap */}
                <div className="p-5 bg-card rounded-xl border border-border-custom transition-colors duration-300">
                    <h3 className="m-0 text-muted text-sm font-medium">Toplam Dolap</h3>
                    <p className="text-4xl font-bold my-2.5 text-primary">8</p>
                </div>
                {/* Toplam Ürün */}
                <div className="p-5 bg-card rounded-xl border border-border-custom transition-colors duration-300">
                    <h3 className="m-0 text-muted text-sm font-medium">Toplam Ürün</h3>
                    <p className="text-4xl font-bold my-2.5 text-primary">245</p>
                </div>
                {/* Kritik Stok */}
                <div className="p-5 bg-card rounded-xl border border-border-custom transition-colors duration-300">
                    <h3 className="m-0 text-muted text-sm font-medium">Kritik Stok</h3>
                    <p className="text-4xl font-bold my-2.5 text-red-500">3</p>
                </div>
            </div>
        </div>
    );
}
