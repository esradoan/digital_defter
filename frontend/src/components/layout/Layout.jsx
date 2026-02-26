import Sidebar from './Sidebar';

export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-sidebar p-8">
                <div className="max-w-content mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
