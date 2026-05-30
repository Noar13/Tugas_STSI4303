import { useState, useEffect, useRef, useCallback } from "react";

function fmtP(p) {
  p = parseFloat(p);
  if (p >= 1000) return p.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (p >= 1) return p.toFixed(2);
  return p.toFixed(5);
}
function fmtPct(v) {
  const n = parseFloat(v);
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}
function fmtMcap(v) {
  v = parseFloat(v);
  if (v >= 1e12) return (v / 1e12).toFixed(1) + "T";
  if (v >= 1e9) return (v / 1e9).toFixed(1) + "B";
  if (v >= 1e6) return (v / 1e6).toFixed(1) + "M";
  return v.toLocaleString();
}

function Sparkline({ pct }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const up = parseFloat(pct) >= 0;
    const col = up ? "#2ecc71" : "#e74c3c";
    const seed = Math.abs(parseFloat(pct) * 137);
    const pts = [];
    let y = H / 2;
    for (let i = 0; i < 12; i++) {
      const rng = ((Math.sin(seed + i * 2.3) * 0.5 + 0.5) - 0.5) * H * 0.7;
      y = Math.max(4, Math.min(H - 4, y + rng));
      pts.push({ x: i * (W / 11), y });
    }
    if (up) pts[pts.length - 1].y = Math.min(pts[pts.length - 1].y, H * 0.3);
    else pts[pts.length - 1].y = Math.max(pts[pts.length - 1].y, H * 0.7);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const cpx = (pts[i - 1].x + pts[i].x) / 2;
      ctx.bezierCurveTo(cpx, pts[i - 1].y, cpx, pts[i].y, pts[i].x, pts[i].y);
    }
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.lineTo(pts[pts.length - 1].x, H);
    ctx.lineTo(pts[0].x, H);
    ctx.closePath();
    ctx.fillStyle = col + "33";
    ctx.fill();
  }, [pct]);
  return <canvas ref={canvasRef} width={80} height={32} style={{ display: "block" }} />;
}

function CoinRow({ coin, delay }) {
  const isUp = parseFloat(coin.percent_change_24h) >= 0;
  const chCol = isUp ? "#2ecc71" : "#e74c3c";
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "90px 80px 1fr 60px",
      alignItems: "center",
      padding: "10px 18px",
      borderBottom: "1px solid #111",
      cursor: "pointer",
      animation: `fadeUp .3s ease both`,
      animationDelay: `${delay}ms`,
      transition: "background .12s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "#1c1c1e"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
          <sup style={{ fontSize: 9, color: "#555", verticalAlign: "super", marginRight: 1 }}>{coin.rank}</sup>
          {coin.symbol}
        </div>
        <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>{coin.name}</div>
      </div>
      <Sparkline pct={coin.percent_change_24h} />
      <div style={{ textAlign: "right", paddingRight: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
          {fmtP(coin.price_usd)}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: chCol }}>{fmtPct(coin.percent_change_24h)}</span>
      </div>
    </div>
  );
}

export default function CryptoPro() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const r = await fetch("https://api.coinlore.net/api/tickers/");
      const d = await r.json();
      setCoins(d.data || []);
    } catch (e) {}
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = coins.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const totalMcap = coins.reduce((s, c) => s + parseFloat(c.market_cap_usd || 0), 0);
  const totalVol  = coins.reduce((s, c) => s + parseFloat(c.volume24 || 0), 0);
  const btc = coins.find(c => c.symbol === "BTC");
  const dom = btc ? (parseFloat(btc.market_cap_usd) / totalMcap * 100).toFixed(2) + "%" : "—";

  return (
    <div style={{
      background: "#1a1a1a", borderRadius: 44, overflow: "hidden",
      maxWidth: 360, margin: "0 auto", border: "8px solid #2a2a2a",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
    }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-300px 0} 100%{background-position:300px 0} }
        input::placeholder { color: #3a3a3a }
        input:focus { outline: none }
      `}</style>

      <div style={{ background: "#000", color: "#fff", minHeight: 720, overflowY: "auto", maxHeight: 760, position: "relative" }}>

        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#e6873a", fontSize: 14, fontWeight: 500 }}>
            ‹ Crypto Pro
          </div>
          <span style={{ color: "#888", fontSize: 14 }}>⌄</span>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#e6873a", fontSize: 13, fontWeight: 600 }}>Mkt↑</span>
            <span style={{ color: "#e6873a", fontSize: 13, fontWeight: 600 }}>USD</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ padding: "6px 18px 10px" }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -.5 }}>All Cryptos</div>
        </div>

        {/* Search + Refresh */}
        <div style={{ padding: "0 14px 10px", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, background: "#1c1c1e", borderRadius: 12, display: "flex", alignItems: "center", padding: "8px 12px", gap: 7 }}>
            <span style={{ color: "#555", fontSize: 15 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              style={{ background: "transparent", border: "none", color: "#fff", fontSize: 15, flex: 1, fontFamily: "inherit" }}
            />
          </div>
          <button
            onClick={() => load(true)}
            style={{ background: "#1c1c1e", border: "none", borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            <span style={{ fontSize: 18, color: "#e6873a", display: "inline-block", animation: refreshing ? "spin .7s linear infinite" : "none" }}>↻</span>
          </button>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: 14, padding: "2px 18px 10px", borderBottom: "1px solid #1c1c1e" }}>
          <span style={{ fontSize: 11, color: "#666" }}>MKT ${coins.length ? fmtMcap(totalMcap) : "—"}</span>
          <span style={{ fontSize: 11, color: "#666" }}>VOL ${coins.length ? fmtMcap(totalVol) : "—"}</span>
          <span style={{ fontSize: 11, color: "#666" }}>DOM {dom}</span>
        </div>

        {/* Coin List */}
        <div style={{ paddingBottom: 70 }}>
          {loading
            ? Array(10).fill(0).map((_, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 80px 1fr 60px", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid #111", gap: 0 }}>
                  <div>
                    <div style={{ height: 14, width: 60, borderRadius: 4, background: `linear-gradient(90deg,#1c1c1e 25%,#252525 50%,#1c1c1e 75%)`, backgroundSize: "400px", animation: `shimmer 1.2s infinite ${i * 80}ms`, marginBottom: 5 }} />
                    <div style={{ height: 10, width: 40, borderRadius: 3, background: `linear-gradient(90deg,#1c1c1e 25%,#252525 50%,#1c1c1e 75%)`, backgroundSize: "400px", animation: `shimmer 1.2s infinite ${i * 80}ms` }} />
                  </div>
                  <div style={{ height: 28, width: 72, borderRadius: 4, background: `linear-gradient(90deg,#1c1c1e 25%,#252525 50%,#1c1c1e 75%)`, backgroundSize: "400px", animation: `shimmer 1.2s infinite ${i * 80}ms` }} />
                  <div style={{ height: 14, width: 55, borderRadius: 4, background: `linear-gradient(90deg,#1c1c1e 25%,#252525 50%,#1c1c1e 75%)`, backgroundSize: "400px", animation: `shimmer 1.2s infinite ${i * 80}ms`, marginLeft: "auto", marginRight: 12 }} />
                  <div style={{ height: 14, width: 48, borderRadius: 4, background: `linear-gradient(90deg,#1c1c1e 25%,#252525 50%,#1c1c1e 75%)`, backgroundSize: "400px", animation: `shimmer 1.2s infinite ${i * 80}ms`, marginLeft: "auto" }} />
                </div>
              ))
            : filtered.slice(0, 30).map((coin, i) => (
                <CoinRow key={coin.id} coin={coin} delay={Math.min(i * 25, 400)} />
              ))
          }
        </div>
      </div>
    </div>
  );
}
