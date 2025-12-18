import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UserFormPage = ({ mode }) => {
    const isEdit = mode === 'edit';
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        level_id: 2,
        name: '',
        username: '',
        password: '',
        newPassword: '',
        newPasswordConfirm: '',
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isEdit && id) {
            axios.get(`/users/${id}`).then(({ data }) => {
                setForm({
                    level_id: data.user.level_id,
                    name: data.user.name,
                    username: data.user.username,
                    password: '',
                    newPassword: '',
                    newPasswordConfirm: '',
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
        const payload = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (isEdit && k === 'password') return;
            if (k === 'newPassword' || k === 'newPasswordConfirm') return;
            payload.append(k, v);
        });
        try {
            if (isEdit) {
                await axios.post(`/users/${id}?_method=PUT`, payload);
                if (form.newPassword) {
                    await axios.post(`/users/${id}/reset-password`, {
                        password: form.newPassword,
                        password_confirmation: form.newPasswordConfirm,
                    });
                }
            } else {
                await axios.post('/users', payload);
            }
            navigate('/users');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Gagal menyimpan user');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>{isEdit ? 'Edit Pegawai' : 'Tambah Pegawai'}</h1>
                    <p className="muted">Administrator</p>
                </div>
            </div>
            <form className="card form" onSubmit={submit}>
                {message && <div className="alert">{message}</div>}
                <label className="field">
                    <span>Level</span>
                    <select name="level_id" value={form.level_id} onChange={handleChange}>
                        <option value={2}>Kasir</option>
                        <option value={3}>Administrator</option>
                    </select>
                </label>
                <label className="field">
                    <span>Nama</span>
                    <input name="name" value={form.name} onChange={handleChange} required />
                </label>
                <label className="field">
                    <span>Username</span>
                    <input name="username" value={form.username} onChange={handleChange} required />
                </label>
                {!isEdit && (
                    <label className="field">
                        <span>Password</span>
                        <input type="password" name="password" value={form.password} onChange={handleChange} required />
                    </label>
                )}
                {isEdit && (
                    <>
                        <label className="field">
                            <span>Ubah Password</span>
                            <input
                                type="password"
                                name="newPassword"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Kosongkan jika tidak ingin mengubah"
                            />
                        </label>
                        <label className="field">
                            <span>Konfirmasi Password</span>
                            <input
                                type="password"
                                name="newPasswordConfirm"
                                value={form.newPasswordConfirm}
                                onChange={handleChange}
                                placeholder="Ulangi password baru"
                            />
                        </label>
                    </>
                )}
                <button className="button primary" type="submit">
                    Simpan
                </button>
            </form>
        </div>
    );
};

export default UserFormPage;
