import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
    const navigate = useNavigate();
    const [menus, setMenus] = useState({ makanan: [], minuman: [], paket_komplit: [] });
    const [selectedCategory, setSelectedCategory] = useState("makanan");
    const [table, setTable] = useState("");
    const [tables, setTables] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [showTableModal, setShowTableModal] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axios.get("/transactions/create");
                setMenus({
                    makanan: data.makanan || data.foods || [],
                    minuman: data.minuman || data.drinks || [],
                    paket_komplit: data.paket_komplit || data.desserts || [],
                });
                // Selalu tampilkan 10 meja (1-10) agar bisa dipilih
                const allTables = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
                setTables(allTables.map((num) => ({ number: num, sold: false })));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const addItem = (menu) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.menu_id === menu.id);
            if (existing) {
                return prev.map((i) =>
                    i.menu_id === menu.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { menu_id: menu.id, name: menu.name, price: menu.price, qty: 1 }];
        });
    };

    const updateQty = (menu_id, qty) => {
        if (qty <= 0) {
            setItems((prev) => prev.filter((i) => i.menu_id !== menu_id));
            return;
        }
        setItems((prev) => prev.map((i) => (i.menu_id === menu_id ? { ...i, qty } : i)));
    };

    const total = useMemo(() => items.reduce((acc, cur) => acc + cur.qty * cur.price, 0), [items]);

    const submit = async () => {
        setMessage("");
        if (!table || !items.length) {
            setMessage("Pilih meja dan menu terlebih dahulu.");
            return;
        }

        try {
            const payload = {
                no_table: table,
                total_transaction: total,
                menu_id: JSON.stringify(items.map((i) => ({ menu_id: i.menu_id, qty: i.qty, price: i.price }))),
            };
            await axios.post("/transactions", payload);
            setMessage("Pesanan berhasil dibuat.");
            setItems([]);
            setTable("");
            navigate("/transactions");
        } catch (err) {
            setMessage(err.response?.data?.message || "Gagal menyimpan pesanan");
        }
    };

    const activeMenus = menus[selectedCategory] || [];

    if (loading) {
        return <div className="page">Memuat menu...</div>;
    }

    const resolveImage = (menu) => {
        const path = menu.picture_url || menu.picture;
        if (!path) return '/images/placeholder-menu.png';
        if (path.startsWith('http')) return path;
        if (path.startsWith('/')) return path;
        return `/storage/${path}`;
    };

    return (
        <div className="page order-page">
            <div className="order-left">
                <div className="page-header">
                    <div>
                        <h1>All Menu&apos;s</h1>
                        <p className="muted">Tambah pesanan dan pilih meja</p>
                    </div>
                </div>

                <div className="order-tabs">
                    <button className={`order-tab ${selectedCategory === "makanan" ? "active" : ""}`} onClick={() => setSelectedCategory("makanan")}>
                        Makanan
                    </button>
                    <button className={`order-tab ${selectedCategory === "minuman" ? "active" : ""}`} onClick={() => setSelectedCategory("minuman")}>
                        Minuman
                    </button>
                    <button className={`order-tab ${selectedCategory === "paket_komplit" ? "active" : ""}`} onClick={() => setSelectedCategory("paket_komplit")}>
                        Paket Komplit
                    </button>
                </div>

                <div className="order-menu-grid">
                    {activeMenus.map((menu) => {
                        const current = items.find((i) => i.menu_id === menu.id);
                        return (
                            <div key={menu.id} className="order-card">
                                <div className="order-card-thumb">
                                    <img
                                        src={resolveImage(menu)}
                                        alt={menu.name}
                                        onError={(e) => (e.target.src = '/images/placeholder-menu.png')}
                                    />
                                </div>
                                <div className="order-card-title">{menu.name}</div>
                                <div className="order-card-price">Rp {menu.price}</div>
                                <div className="order-card-actions">
                                    <button onClick={() => updateQty(menu.id, (current?.qty || 0) - 1)}>-</button>
                                    <span>{current?.qty || 0}</span>
                                    <button onClick={() => addItem(menu)}>+</button>
                                </div>
                            </div>
                        );
                    })}
                    {!activeMenus.length && <div className="muted">Menu tidak tersedia.</div>}
                </div>
            </div>

            <div className="order-right">
                <div className="order-panel">
                    <div className="order-panel-header">
                        <div>
                            <h3>Current Order</h3>
                            <small className="muted">Tanggal: {new Date().toLocaleDateString("id-ID")}</small>
                        </div>
                    </div>
                    <div className="order-panel-body">
                        <div className="order-panel-label">Table</div>
                        <div className="order-panel-table">
                            <span>{table || "Belum dipilih"}</span>
                            <button className="button primary outline" onClick={() => setShowTableModal(true)}>Pilih</button>
                        </div>

                        <div className="order-items">
                            {items.map((item) => (
                                <div key={item.menu_id} className="order-item">
                                    <div>
                                        <div className="order-item-name">{item.name}</div>
                                        <div className="muted">Rp {item.price}</div>
                                    </div>
                                    <div className="order-item-qty">
                                        <button onClick={() => updateQty(item.menu_id, item.qty - 1)}>-</button>
                                        <span>{item.qty}</span>
                                        <button onClick={() => updateQty(item.menu_id, item.qty + 1)}>+</button>
                                    </div>
                                    <div className="order-item-subtotal">Rp {item.qty * item.price}</div>
                                </div>
                            ))}
                            {!items.length && <div className="empty dark">Belum ada item.</div>}
                        </div>

                        <div className="order-summary">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <strong>Rp {total}</strong>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <strong>Rp {total}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="order-panel-footer">
                        <button className="button primary block" onClick={submit}>Place Order</button>
                    </div>
                </div>
            </div>

            {showTableModal && (
                <div className="modal">
                    <div className="modal-content order-modal">
                        <div className="modal-header">
                            <h3>Pilih Meja</h3>
                            
                        </div>
                        <p className="muted">Pilih meja pelanggan (1-10).</p>
                        <div className="table-grid">
                            {tables.map((t) => (
                                <button
                                    key={t.number}
                                    className={`table-chip ${table === t.number ? "active" : ""}`}
                                    onClick={() => setTable(t.number)}
                                >
                                    {t.number}
                                </button>
                            ))}
                            {!tables.length && <div className="muted">Tidak ada meja tersedia.</div>}
                        </div>
                        <div className="modal-actions">
                            <button className="button danger" onClick={() => setShowTableModal(false)}>Batal</button>
                            <button className="button primary" onClick={() => setShowTableModal(false)}>Pilih</button>
                        </div>
                    </div>
                </div>
            )}

            {message && <div className="alert">{message}</div>}
        </div>
    );
};

export default OrderPage;








