import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const MenuFormPage = ({ mode }) => {
    const isEdit = mode === 'edit';
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        modal: '',
        price: '',
        category: 'makanan',
        description: '',
    });
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isEdit && id) {
            axios.get(`/menus/${id}`).then(({ data }) => {
                setForm({
                    name: data.name,
                    modal: data.modal,
                    price: data.price,
                    category: data.category,
                    description: data.description || '',
                });
            });
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (submitting) return;
        setSubmitting(true);

        const payload = new FormData();
        Object.entries(form).forEach(([key, value]) => payload.append(key, value));
        if (file) {
            payload.append(isEdit ? 'picture' : 'image', file);
        }

        try {
            if (isEdit) {
                await axios.post(`/menus/${id}?_method=PUT`, payload);
            } else {
                await axios.post('/menus', payload);
            }
            navigate('/menus');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Gagal menyimpan data');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page menu-form">
            <div className="page-header">
                <div>
                    <h1>{isEdit ? 'Edit Menu' : 'Tambah Menu'}</h1>
                    <p className="muted">Administrator - Pastikan data lengkap</p>
                </div>
            </div>
            {message && <div className="alert">{message}</div>}
            <form className="form-grid" onSubmit={submit} encType="multipart/form-data">
                <div className="card form dark-panel">
                    <h3 className="form-title">Informasi Menu</h3>
                    <label className="field">
                        <span>Nama Menu</span>
                        <input name="name" value={form.name} onChange={handleChange} required />
                    </label>
                    <div className="inline duo">
                        <label className="field">
                            <span>Modal</span>
                            <input name="modal" value={form.modal} onChange={handleChange} required />
                        </label>
                        <label className="field">
                            <span>Harga</span>
                            <input name="price" value={form.price} onChange={handleChange} required />
                        </label>
                    </div>
                    <label className="field">
                        <span>Kategori</span>
                        <select name="category" value={form.category} onChange={handleChange}>
                            <option value="makanan">Makanan</option>
                            <option value="minuman">Minuman</option>
                            <option value="paket_komplit">Paket Komplit</option>
                        </select>
                    </label>
                    <label className="field">
                        <span>Deskripsi</span>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
                    </label>
                </div>
                <div className="card form light-panel">
                    <h3 className="form-title">Media & Aksi</h3>
                    <label className="field">
                        <span>Gambar</span>
                        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
                    </label>
                    <div className="muted tips">
                        Gunakan gambar berkualitas; ukuran ideal 800x600, format jpg/png.
                    </div>
                    <button className="button primary block" type="submit" disabled={submitting}>
                        {submitting ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button className="button danger block" type="button" onClick={() => navigate('/menus')}>
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MenuFormPage;

