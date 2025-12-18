import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [payAmount, setPayAmount] = useState("");
    const [processing, setProcessing] = useState(false);

    const load = async () => {
        try {
            const { data } = await axios.get(`/transactions/${id}`);
            setData(data.data?.[0] || null);
            setError("");
        } catch (err) {
            setError("Gagal memuat data transaksi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [id]);

    const subtotal = useMemo(() => {
        if (!data?.transaction_details) return 0;
        return data.transaction_details.reduce((sum, d) => sum + d.qty * d.price, 0);
    }, [data]);

    const formatCurrency = (val) => `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

    const pay = async () => {
        if (!payAmount) {
            setError("Masukkan total pembayaran");
            return;
        }
        setProcessing(true);
        try {
            const payNumber = Number(payAmount);
            await axios.put(`/transactions/${id}`, {
                total_transaction: subtotal,
                total_payment: payNumber,
            });
            setError("");
            window.open(`/invoice/${id}/print`, "_blank");
            navigate("/transactions");
        } catch (err) {
            setError(err.response?.data?.message || "Pembayaran gagal");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="page">Memuat pembayaran...</div>;
    if (!data) return (
        <div className="page">
            <div className="alert">Transaksi tidak ditemukan.</div>
            <Link className="button primary" to="/transactions">Kembali</Link>
        </div>
    );

    return (
        <div className="page payment-page">
            <div className="page-header">
                <div>
                    <h1>Payment</h1>
                    <p className="muted">Pembayaran transaksi #{id}</p>
                </div>
                <button className="button ghost" onClick={() => navigate(-1)}>Kembali</button>
            </div>
            {error && <div className="alert">{error}</div>}
            <div className="grid two">
                <div className="card">
                    <div className="card-header"><h3>List Order</h3></div>
                    <div className="table">
                        <div className="table-head">
                            <span>Menu</span>
                            <span>Qty</span>
                            <span>Subtotal</span>
                        </div>
                        {data.transaction_details?.map((detail) => (
                            <div key={detail.id} className="table-row">
                                <span>{detail.menu?.name}</span>
                                <span>{detail.qty}</span>
                                <span>{formatCurrency(detail.qty * detail.price)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="summary-row total" style={{ marginTop: 12 }}>
                        <span>Total</span>
                        <strong>{formatCurrency(subtotal)}</strong>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header"><h3>Payment Details</h3></div>
                    <div className="form">
                        <label className="field">
                            <span>Kasir</span>
                            <input readOnly value={data.user?.name || "-"} />
                        </label>
                        <label className="field">
                            <span>No Meja</span>
                            <input readOnly value={data.no_table || "-"} />
                        </label>
                        <label className="field">
                            <span>Total Transaksi</span>
                            <input readOnly value={formatCurrency(subtotal)} />
                        </label>
                        <label className="field">
                            <span>Total Bayar</span>
                            <input value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="Masukkan nominal" />
                        </label>
                        <button className="button primary" type="button" onClick={pay} disabled={processing}>
                            {processing ? "Memproses..." : "Bayar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
