import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const LoginPage = () => {
    const { user, login, setError, error } = useAuth();
    const [form, setForm] = useState({ username: '', password: '', remember: false });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await login(form);
            const target = location.state?.from?.pathname || '/dashboard';
            navigate(target, { replace: true });
        } catch (err) {
            const message = err.response?.data?.message || 'Gagal login, periksa kembali username / password';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">
                <div className="login-hero">
                    <div className="hero-eyebrow">Kasir Restoran</div>
                    <h1>Masuk & mulai melayani</h1>
                    <p>
                        Kelola pesanan, transaksi, dan laporan penjualan secara cepat, akurat, dan real-time untuk operasional Dapoer Bangau yang lebih efisien.
                    </p>
                    <div className="hero-grid">
                        <div className="hero-card">
                            <span>Mode Admin</span>
                            <strong>Kelola menu & Pegawai</strong>
                        </div>
                        <div className="hero-card">
                            <span>Mode Kasir</span>
                            <strong>Proses order kilat</strong>
                        </div>
                        <div className="hero-card">
                            <span>Realtime</span>
                            <strong>Invoice & pembayaran</strong>
                        </div>
                    </div>
                    <div className="hero-tags">
                        <span>Praktis</span>
                        <span>Kontras</span>
                        <span>Aman</span>
                    </div>
                </div>

                <form className="login-card" onSubmit={handleSubmit}>
                    <div className="login-card-header">
                        <div className="login-logo">
                            <div className="logo-mark">KB</div>
                            <div>
                                <div className="logo-text">DapoerBangau</div>
                                <div className="muted small-text">Masuk ke dashboard DapoerBangau</div>
                            </div>
                        </div>
                        <h2>Masuk Akun</h2>
                        <p className="muted">Sederhana, cepat, dan siap dipakai.</p>
                    </div>
                    {error && <div className="alert">{error}</div>}
                    <label className="field">
                        <span>Username</span>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            placeholder="admin"
                        />
                    </label>
                    <label className="field">
                        <span>Password</span>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="********"
                        />
                    </label>
                    <label className="checkbox">
                        <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
                        <span>Ingat saya</span>
                    </label>
                    <button className="button primary block" disabled={submitting}>
                        {submitting ? 'Memproses...' : 'Masuk Sekarang'}
                    </button>
                    <small className="muted center">
                        Jaga kerahasiaan akun Anda. Pastikan logout setelah selesai.
                    </small>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
