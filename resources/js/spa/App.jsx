import React from 'react';
import { NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import OrderPage from './pages/OrderPage';
import MenuListPage from './pages/MenuListPage';
import MenuFormPage from './pages/MenuFormPage';
import UsersPage from './pages/UsersPage';
import UserFormPage from './pages/UserFormPage';
import PaymentPage from './pages/PaymentPage';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="page page-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="page page-center">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.level_id !== 3) return <Navigate to="/dashboard" replace />;
    return <Outlet />;
};

const AppShell = () => {
    const { user, logout } = useAuth();

    const navItems = (() => {
        if (!user) return [];
        if (user.level_id === 3) {
            // Admin: Dashboard, Semua Transaksi, Kelola Menu, Pegawai
            return [
                { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
                { to: '/transactions', label: 'Semua Transaksi', icon: '📑' },
                { to: '/menus', label: 'Kelola Menu', icon: '🍽️' },
                { to: '/users', label: 'Pegawai', icon: '👥' },
            ];
        }
        // Kasir: Dashboard, Semua Transaksi, Pemesanan
        return [
            { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
            { to: '/transactions', label: 'Semua Transaksi', icon: '📑' },
            { to: '/order', label: 'Pemesanan', icon: '🛒' },
        ];
    })();

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <span className="brand-icon" aria-hidden="true">DB</span>
                    <div>
                        <div className="brand-title">DapoerBangau</div>
                        <div className="brand-sub">Kasir</div>
                    </div>
                </div>
                <nav className="menu">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    {user && (
                        <>
                            <div className="user-block">
                                <div className="user-name">{user.name}</div>
                            </div>
                            <button className="button ghost block" onClick={logout}>Keluar</button>
                        </>
                    )}
                </div>
            </aside>
            <main className="main">
                <header className="topbar">
                    <div className="breadcrumbs">DapoerBangau</div>
                </header>
                <div className="content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppShell />}>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/transactions" element={<TransactionsPage />} />
                        <Route path="/transactions/:id" element={<TransactionDetailPage />} />
                        <Route path="/transactions/:id/pay" element={<PaymentPage />} />
                        <Route path="/order" element={<OrderPage />} />
                        <Route element={<AdminRoute />}>
                            <Route path="/menus" element={<MenuListPage />} />
                            <Route path="/menus/new" element={<MenuFormPage mode="create" />} />
                            <Route path="/menus/:id/edit" element={<MenuFormPage mode="edit" />} />
                            <Route path="/users" element={<UsersPage />} />
                            <Route path="/users/new" element={<UserFormPage mode="create" />} />
                            <Route path="/users/:id/edit" element={<UserFormPage mode="edit" />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </AuthProvider>
    );
};

export default App;
