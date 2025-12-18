import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth';

const TransactionsPage = () => {
    const { user } = useAuth();
    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [printing, setPrinting] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axios.get('/transactions', {
                    params: {
                        year: year || undefined,
                        month: month || undefined,
                    },
                });
                setPayload(data);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [year, month]);

    const PAGE_SIZE = 20;
    const [pageAll, setPageAll] = useState(1);
    const [pageToday, setPageToday] = useState(1);
    const [pageMonth, setPageMonth] = useState(1);

    const source = useMemo(() => {
        return activeTab === 'today'
            ? payload?.today
            : activeTab === 'month'
                ? payload?.thisMonth
                : payload?.all;
    }, [activeTab, payload]);

    const totalPages = useMemo(() => {
        const total = source?.data?.length || 0;
        return Math.ceil(total / PAGE_SIZE);
    }, [source]);

    const pagedRows = useMemo(() => {
        const list = source?.data || [];
        const currentPage =
            activeTab === 'today'
                ? pageToday
                : activeTab === 'month'
                    ? pageMonth
                    : pageAll;
        const start = (currentPage - 1) * PAGE_SIZE;
        const slice = list.slice(start, start + PAGE_SIZE);
        return slice.map((item, idx) => {
            const firstDetail = item.transaction_details?.[0];
            const product = firstDetail?.menu?.name || '-';
            const date = item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-';
            return {
                no: start + idx + 1,
                id: item.id,
                product,
                no_table: item.no_table,
                date,
                status: item.status,
                total: item.total_transaction,
            };
        });
    }, [activeTab, source, pageAll, pageToday, pageMonth]);

    const changePage = (nextPage) => {
        const max = totalPages || 1;
        const valid = Math.min(Math.max(nextPage, 1), max);
        if (activeTab === 'today') setPageToday(valid);
        else if (activeTab === 'month') setPageMonth(valid);
        else setPageAll(valid);
    };

    const renderPagination = () => {
        if (!totalPages || totalPages <= 1) return null;
        const current =
            activeTab === 'today'
                ? pageToday
                : activeTab === 'month'
                    ? pageMonth
                    : pageAll;
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        return (
            <div className="pagination">
                <button
                    className="page-btn"
                    onClick={() => changePage(current - 1)}
                    disabled={current === 1}
                >
                    &lt;
                </button>
                {pages.map((p) => (
                    <button
                        key={p}
                        className={`page-btn${p === current ? ' active' : ''}`}
                        onClick={() => changePage(p)}
                    >
                        {p}
                    </button>
                ))}
                <button
                    className="page-btn"
                    onClick={() => changePage(current + 1)}
                    disabled={current === totalPages}
                >
                    &gt;
                </button>
            </div>
        );
    };

    const monthLabel = useMemo(
        () => ({
            '1': 'Januari',
            '2': 'Februari',
            '3': 'Maret',
            '4': 'April',
            '5': 'Mei',
            '6': 'Juni',
            '7': 'Juli',
            '8': 'Agustus',
            '9': 'September',
            '10': 'Oktober',
            '11': 'November',
            '12': 'Desember',
        }),
        []
    );

    const handlePrint = () => {
        const source =
            activeTab === 'today'
                ? payload?.today
                : activeTab === 'month'
                    ? payload?.thisMonth
                    : payload?.all;
        const list = source?.data || [];
        if (!list.length || printing) return;

        const tabTitle = activeTab === 'today' ? 'Transaksi Hari Ini' : activeTab === 'month' ? 'Transaksi Bulan Ini' : 'Semua Transaksi';
        const yearLabel = year || 'Semua';
        const monthName = month ? monthLabel[month] || month : 'Semua';
        const formatCurrency = (val) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`;

        const rowsHtml = list
            .map((item, idx) => {
                const product = item.transaction_details?.[0]?.menu?.name || '-';
                const date = item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-';
                return `<tr>
                    <td>${idx + 1}</td>
                    <td>${product}</td>
                    <td>${item.no_table ?? '-'}</td>
                    <td>${date}</td>
                    <td style="text-transform: capitalize;">${item.status}</td>
                    <td>${formatCurrency(item.total_transaction)}</td>
                </tr>`;
            })
            .join('');

        const printStyles = `
            body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; padding: 24px; color: #0f172a; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
            .title { font-size: 20px; font-weight: 700; }
            .meta { color: #475569; font-size: 13px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { padding: 10px 12px; border: 1px solid #e2e8f0; font-size: 13px; }
            th { background: #f8fafc; text-align: left; color: #475569; }
            tr:nth-child(even) { background: #f9fafb; }
        `;

        const html = `
            <html>
                <head>
                    <title>${tabTitle}</title>
                    <style>${printStyles}</style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <div class="title">${tabTitle}</div>
                            <div class="meta">Tahun: ${yearLabel} | Bulan: ${monthName}</div>
                        </div>
                        <div class="meta">Dicetak: ${new Date().toLocaleString('id-ID')}</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Produk</th>
                                <th>No Meja</th>
                                <th>Tanggal</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        setPrinting(true);
        const w = window.open('', '_blank');
        if (!w) {
            setPrinting(false);
            return;
        }
        w.document.write(html);
        w.document.close();
        w.focus();
        w.print();
        w.close();
        setPrinting(false);
    };

    if (loading) {
        return <div className="page">Memuat transaksi...</div>;
    }

    return (
        <div className="page transactions">
            <div className="page-header">
                <div>
                    <h1>Semua Transaksi</h1>
                    <p className="muted">Admin & Kasir</p>
                </div>
            </div>

            <div className="toolbar">
                <div className="filters">
                    <select className="input" value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value="">Pilih Tahun</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                    <select className="input" value={month} onChange={(e) => setMonth(e.target.value)}>
                        <option value="">Pilih Bulan</option>
                        <option value="1">Januari</option>
                        <option value="2">Februari</option>
                        <option value="3">Maret</option>
                        <option value="4">April</option>
                        <option value="5">Mei</option>
                        <option value="6">Juni</option>
                        <option value="7">Juli</option>
                        <option value="8">Agustus</option>
                        <option value="9">September</option>
                        <option value="10">Oktober</option>
                        <option value="11">November</option>
                        <option value="12">Desember</option>
                    </select>
                    <button
                        className="print-btn"
                        type="button"
                        onClick={handlePrint}
                        disabled={!(source?.data?.length) || printing}
                    >
                        Print
                    </button>
                </div>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All
                </button>
                <button
                    className={`tab ${activeTab === 'today' ? 'active' : ''}`}
                    onClick={() => setActiveTab('today')}
                >
                    Today
                </button>
                <button
                    className={`tab ${activeTab === 'month' ? 'active' : ''}`}
                    onClick={() => setActiveTab('month')}
                >
                    This Month
                </button>
            </div>

            <div className="card">
                <div className="table">
                    <div className="table-head transactions-head">
                        <span>No</span>
                        <span>Product</span>
                        <span>No Table</span>
                        <span>Date</span>
                        <span>Status</span>
                        <span>Total</span>
                        <span>Aksi</span>
                    </div>
                    {pagedRows.map((row) => (
                        <div key={row.id} className="table-row">
                            <span>{row.no}</span>
                            <span>{row.product}</span>
                            <span>{row.no_table}</span>
                            <span>{row.date}</span>
                            <span className={row.status === 'paid' ? 'pill success' : 'pill warning'}>{row.status}</span>
                            <span>{row.total}</span>
                            <span className="inline">
                                {user?.level_id === 2 ? (
                                    <Link className="link" to={`/transactions/${row.id}/pay`}>Bayar</Link>
                                ) : (
                                    <span className="muted small">-</span>
                                )}
                            </span>
                        </div>
                    ))}
                    {!pagedRows.length && <div className="empty">Belum ada transaksi.</div>}
                </div>
                {renderPagination()}
            </div>
        </div>
    );
};

export default TransactionsPage;
