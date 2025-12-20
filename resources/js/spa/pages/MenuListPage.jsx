import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MenuListPage = () => {
    const [menus, setMenus] = useState({ makanan: [], minuman: [], paket_komplit: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('makanan');
    const [openMenuId, setOpenMenuId] = useState(null);
    const navigate = useNavigate();

    const load = async () => {
        const { data } = await axios.get('/menus');
        setMenus({
            makanan: data.makanan || data.foods || [],
            minuman: data.minuman || data.drinks || [],
            paket_komplit: data.paket_komplit || data.dessert || [],
        });
    };

    useEffect(() => {
        load().finally(() => setLoading(false));
    }, []);

    const remove = async (id) => {
        const ok = window.confirm('Hapus menu ini?');
        if (!ok) return;
        await axios.delete(`/menus/${id}`);
        load();
    };

    const cards = useMemo(() => {
        const list = menus[activeTab] || [];
        return list.map((row) => ({
            ...row,
            priceFormatted: `IDR ${Number(row.price || 0).toLocaleString('id-ID')}`,
            pictureUrl: row.picture_url || row.picture || '/images/placeholder-menu.png',
        }));
    }, [menus, activeTab]);

    if (loading) {
        return <div className="page">Memuat menu...</div>;
    }

    return (
        <div className="page menu-admin">
            <div className="page-header">
                <div>
                    <h1>All Menu&apos;s</h1>
                    <p className="muted">Pilih kategori dan kelola menu</p>
                </div>
                <Link className="button primary" to="/menus/new">Tambah Menu</Link>
            </div>

                        <div className="order-tabs">
                <button className={`order-tab ${activeTab === 'makanan' ? 'active' : ''}`} onClick={() => setActiveTab('makanan')}>
                    Makanan
                </button>
                <button className={`order-tab ${activeTab === 'minuman' ? 'active' : ''}`} onClick={() => setActiveTab('minuman')}>
                    Minuman
                </button>
                <button className={`order-tab ${activeTab === 'paket_komplit' ? 'active' : ''}`} onClick={() => setActiveTab('paket_komplit')}>
                    Paket Komplit
                </button>
            </div>

            <div className="menu-admin-grid">
                {cards.map((row) => (
                    <div key={row.id} className="menu-admin-card">
                        <div className="menu-admin-thumb">
                            <img
                                src={row.pictureUrl}
                                alt={row.name}
                                onError={(e) => (e.target.src = '/images/placeholder-menu.png')}
                            />
                        </div>
                        <div className="menu-admin-name">{row.name}</div>
                        <div className="menu-admin-price">{row.priceFormatted}</div>
                        <div className="menu-admin-actions" style={{ position: 'relative' }}>
                            <button
                                type="button"
                                className="button ghost icon-only"
                                onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
                                aria-label="Menu aksi"
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: 12,
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    color: '#334155',
                                    fontSize: 18,
                                    lineHeight: 1,
                                }}
                            >
                                ⋮
                            </button>
                            {openMenuId === row.id && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '110%',
                                        background: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 12,
                                        boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                                        minWidth: 140,
                                        zIndex: 5,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <button
                                        className="link"
                                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px' }}
                                        onClick={() => {
                                            setOpenMenuId(null);
                                            navigate(`/menus/${row.id}/edit`);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="link danger"
                                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px' }}
                                        onClick={() => {
                                            setOpenMenuId(null);
                                            remove(row.id);
                                        }}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {!cards.length && <div className="empty">Belum ada data.</div>}
            </div>
        </div>
    );
};

export default MenuListPage;









