import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth";

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/dashboard")
      .then(() => setError(""))
      .catch(() => setError("Gagal memuat dashboard. Coba muat ulang atau login kembali."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page">Memuat dashboard...</div>;

  return (
    <div className="page dashboard">
      {error && <div className="alert">{error}</div>}

      <div
        style={{
          background: "linear-gradient(135deg, #0F172A 0%, #0EA371 100%)",
          borderRadius: 24,
          padding: "28px 32px",
          color: "#F8FAFC",
          boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
          minHeight: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.12)",
              fontSize: 12,
              letterSpacing: 0.2,
            }}
          >
            DapoerBangau
          </div>
          <h1 style={{ margin: "12px 0 8px", fontSize: 32, fontWeight: 700 }}>
            Selamat Datang, {user?.nama || "Pengguna"}!
          </h1>
          <p style={{ opacity: 0.9, lineHeight: 1.6, fontSize: 15 }}>
            Kelola restoran dengan dashboard modern: pantau transaksi, menu, dan tim dalam satu tempat.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: "16px 20px",
            minWidth: 240,
            backdropFilter: "blur(6px)",
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Sekilas Info</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8, fontSize: 14 }}>
            <li>- Kendalikan menu & pesanan di satu tempat</li>
            <li>- Catat transaksi harian dengan cepat</li>
            <li>- Pantau kinerja tim dan kasir</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

