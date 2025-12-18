import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const levelLabel = (level) => {
    if (level === 3) return 'ADMIN';
    if (level === 2) return 'CASHIER';
    return 'STAFF';
};

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    const load = async () => {
        const { data } = await axios.get('/users');
        setUsers(data.users || []);
        setSelected([]);
    };

    useEffect(() => {
        load().finally(() => setLoading(false));
    }, []);

    const toggleSelect = (userId) => {
        setSelected((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const removeSingle = async (userId) => {
        const payload = new FormData();
        payload.append('users[]', userId);
        await axios.post(`/users/${userId}?_method=DELETE`, payload);
        load();
    };

    const removeSelected = async () => {
        if (!selected.length) return;
        const payload = new FormData();
        selected.forEach((id) => payload.append('users[]', id));
        await axios.post(`/users/${selected[0]}?_method=DELETE`, payload);
        load();
    };

    const allChecked = selected.length === users.length && users.length > 0;

    if (loading) {
        return <div className="page">Memuat pegawai...</div>;
    }

    return (
        <div className="page employees">
            <div className="page-header">
                <div>
                    <h1>All Pegawai</h1>
                    <p className="muted">Kelola data pegawai dan peran</p>
                </div>
                <Link className="button primary" to="/users/new">Tambah Pegawai</Link>
            </div>
            <div className="employee-list">
                {users.map((user) => (
                    <div key={user.id} className="employee-card">
                        <div className="employee-info">
                            <input
                                type="checkbox"
                                checked={selected.includes(user.id)}
                                onChange={() => toggleSelect(user.id)}
                            />
                            <div>
                                <div className="employee-name">{user.name}</div>
                                <div className="muted small">Username: {user.username}</div>
                            </div>
                        </div>
                        <div className="employee-actions">
                            <span className="badge">{levelLabel(user.level_id)}</span>
                            <div className="action-buttons">
                                <button className="link" onClick={() => navigate(`/users/${user.id}/edit`)}>Edit</button>
                            </div>
                        </div>
                    </div>
                ))}
                {!users.length && <div className="empty">Belum ada data.</div>}
            </div>
            {users.length > 0 && (
                <div className="employee-footer">
                    <label className="inline">
                        <input
                            type="checkbox"
                            checked={allChecked}
                            onChange={(e) => setSelected(e.target.checked ? users.map((u) => u.id) : [])}
                        />
                        <span>Pilih semua</span>
                    </label>
                    <button
                        className="button danger solid"
                        disabled={!selected.length}
                        onClick={removeSelected}
                    >
                        Hapus Terpilih ({selected.length})
                    </button>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
