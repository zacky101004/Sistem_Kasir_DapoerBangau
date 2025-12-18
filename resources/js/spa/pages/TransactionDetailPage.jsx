import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TransactionDetailPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axios.get(`/transactions/${id}`);
                setData(data.data?.[0]);
                setError('');
            } catch (err) {
                setError('Transaksi tidak ditemukan atau gagal dimuat.');
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) {
        return <div className="page">Memuat detail...</div>;
    }

    if (!data) {
        return <div className="page">{error || 'Transaksi tidak ditemukan.'}</div>;
    }

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h1>Detail Transaksi #{data.id}</h1>
                    <p className="muted">Kasir</p>
                </div>
            </div>
            <div className="card">
                <div className="table">
                    <div className="table-head">
                        <span>Menu</span>
                        <span>Qty</span>
                        <span>Harga</span>
                    </div>
                    {data.transaction_details?.map((detail) => (
                        <div key={detail.id} className="table-row">
                            <span>{detail.menu?.name}</span>
                            <span>{detail.qty}</span>
                            <span>{detail.price}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="stat">
                <span className="muted">Status</span>
                <strong className={data.status === 'paid' ? 'pill success' : 'pill warning'}>{data.status}</strong>
            </div>
            <div className="stat">
                <span className="muted">Total</span>
                <strong>{data.total_transaction}</strong>
            </div>
            <div className="inline">
                <Link className="button primary" to={`/transactions/${data.id}/pay`}>Bayar</Link>
            </div>
        </div>
    );
};

export default TransactionDetailPage;
