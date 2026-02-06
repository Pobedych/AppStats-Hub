import { Link } from "react-router-dom";
import { apiGet, clearToken, getToken } from "../api/client";
import { useMemo, useState } from "react";

function normalizeError(e: any): string {
  if (!e) return "Ошибка";
  if (typeof e === "string") return e;
  if (e?.message && typeof e.message === "string") return e.message;

  const maybe =
    e?.response?.data?.detail ||
    e?.response?.data?.message ||
    e?.data?.detail ||
    e?.detail;

  if (typeof maybe === "string") return maybe;
  return "Ошибка";
}

export default function Home() {
  const [me, setMe] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = getToken();
  const isAuthed = !!token;

  const prettyCreatedAt = useMemo(() => {
    const raw = me?.created_at;
    if (!raw) return null;
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return raw;
    return d.toLocaleString();
  }, [me]);

  async function loadMe() {
    setErr(null);
    setMe(null);
    try {
      setLoading(true);
      const data = await apiGet("/auth/me");
      setMe(data);
    } catch (e: any) {
      setErr(normalizeError(e));
    } finally {
      setLoading(false);
    }
  }

  function doLogout() {
    clearToken();
    setMe(null);
    setErr(null);
  }

  return (
    <div style={styles.page}>
      {/* BACKGROUND */}
      <div style={styles.bg} aria-hidden="true">
        <div style={styles.noise} />
        <div style={styles.orb1} />
        <div style={styles.orb2} />
        <div style={styles.grid} />
        <div style={styles.vignette} />
      </div>

      <div style={styles.shell}>
        {/* TOP BAR */}
        <div style={styles.topRow}>
          <div style={styles.brandRow}>
            <div style={styles.logo} />
            <div>
              <div style={styles.brand}>App Statistics</div>
              <div style={styles.sub}>Dashboard preview</div>
            </div>
          </div>

          <div style={styles.nav}>
            <Link to="/register" style={styles.navLink}>
              Register
            </Link>
            <Link to="/login" style={styles.navLink}>
              Login
            </Link>
          </div>
        </div>

        {/* MAIN CARD */}
        <div style={styles.card} className="glass-card">
          <div style={styles.cardShine} aria-hidden="true" />
          <div style={styles.cardShine2} aria-hidden="true" />

          <div style={styles.cardInner}>
            <div style={styles.headerRow}>
              <div>
                <h1 style={styles.h1}>Statistics</h1>
                <p style={styles.p}>
                  {isAuthed
                    ? "Token найден — можешь запросить профиль."
                    : "Ты не авторизован. Зайди или зарегистрируйся."}
                </p>
              </div>

              <div style={styles.badgeWrap}>
                <div
                  style={{
                    ...styles.badge,
                    background: isAuthed
                      ? "rgba(120,255,188,0.10)"
                      : "rgba(255,255,255,0.08)",
                    borderColor: isAuthed
                      ? "rgba(120,255,188,0.22)"
                      : "rgba(255,255,255,0.18)",
                  }}
                >
                  <span
                    style={{
                      ...styles.badgeDot,
                      background: isAuthed
                        ? "rgba(120,255,188,0.95)"
                        : "rgba(255,255,255,0.65)",
                      boxShadow: isAuthed
                        ? "0 0 0 4px rgba(120,255,188,0.12)"
                        : "0 0 0 4px rgba(255,255,255,0.10)",
                    }}
                  />
                  <span style={styles.badgeText}>
                    {isAuthed ? "Authenticated" : "Guest"}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div style={styles.actions}>
              <button
                onClick={loadMe}
                disabled={!isAuthed || loading}
                className="glass-btn"
                style={{
                  ...styles.primaryBtn,
                  opacity: !isAuthed || loading ? 0.65 : 1,
                  cursor: !isAuthed || loading ? "not-allowed" : "pointer",
                }}
              >
                <span style={styles.btnText}>
                  {loading ? "Loading..." : "Fetch /auth/me"}
                </span>
                <span style={styles.btnGlow} aria-hidden="true" />
              </button>

              <button
                onClick={doLogout}
                className="glass-btn"
                style={{
                  ...styles.secondaryBtn,
                  opacity: isAuthed ? 1 : 0.65,
                  cursor: isAuthed ? "pointer" : "not-allowed",
                }}
                disabled={!isAuthed}
              >
                Logout
              </button>
            </div>

            {/* ERROR */}
            {err && (
              <div style={styles.alertErr} role="alert">
                <span style={styles.alertDot} />
                <span style={styles.alertText}>{err}</span>
              </div>
            )}

            {/* RESULT */}
            {me && (
              <>
                {/* quick cards */}
                <div style={styles.quickGrid}>
                  <div style={styles.quickCard}>
                    <div style={styles.quickLabel}>Email</div>
                    <div style={styles.quickValue}>{me.email ?? "—"}</div>
                  </div>
                  <div style={styles.quickCard}>
                    <div style={styles.quickLabel}>Username</div>
                    <div style={styles.quickValue}>{me.username ?? "—"}</div>
                  </div>
                  <div style={styles.quickCard}>
                    <div style={styles.quickLabel}>Status</div>
                    <div style={styles.quickValue}>
                      {me.is_active ? "active" : "inactive"}
                      {me.is_premium ? " · premium" : ""}
                    </div>
                  </div>
                  <div style={styles.quickCard}>
                    <div style={styles.quickLabel}>Created</div>
                    <div style={styles.quickValue}>
                      {prettyCreatedAt ?? me.created_at ?? "—"}
                    </div>
                  </div>
                </div>

                {/* json */}
                <div style={styles.codeWrap}>
                  <div style={styles.codeHeader}>
                    <div style={styles.codeTitle}>Response JSON</div>
                    <div style={styles.codeHint}>/auth/me</div>
                  </div>
                  <pre style={styles.code}>
                    {JSON.stringify(me, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={styles.smallPrint}>
          Secure access · Encrypted session
        </div>
      </div>

      {/* hover/focus animations (как на login/register) */}
      <style>{`
        .glass-card { transition: transform 160ms ease; }
        .glass-card:hover { transform: translateY(-2px); }

        .glass-btn { transition: transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease; }
        .glass-btn:hover { transform: translateY(-1px); }
        .glass-btn:active { transform: translateY(0px); }

        @keyframes shineMove {
          0% { transform: translateX(-35%) rotate(8deg); opacity: 0.55; }
          50% { opacity: 0.85; }
          100% { transform: translateX(35%) rotate(8deg); opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    height: "100vh",
    width: "100vw",
    display: "grid",
    placeItems: "center",
    position: "relative",
    overflow: "hidden",
    color: "white",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
  },

  bg: { position: "absolute", inset: 0, background: "#070707" },
  grid: {
    position: "absolute",
    inset: -2,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
    backgroundSize: "46px 46px",
    opacity: 0.55,
    maskImage:
      "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.85) 45%, transparent 72%)",
  },
  noise: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
    opacity: 0.09,
    mixBlendMode: "overlay",
    pointerEvents: "none",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.9) 100%)",
    pointerEvents: "none",
  },
  orb1: {
    position: "absolute",
    width: 560,
    height: 560,
    top: "-20%",
    left: "-18%",
    borderRadius: 999,
    background:
      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.38), transparent 62%)",
    filter: "blur(14px)",
    opacity: 0.85,
  },
  orb2: {
    position: "absolute",
    width: 680,
    height: 680,
    bottom: "-26%",
    right: "-22%",
    borderRadius: 999,
    background:
      "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.28), transparent 66%)",
    filter: "blur(16px)",
    opacity: 0.85,
  },

  shell: {
    width: "100%",
    maxWidth: 920,
    padding: 24,
    position: "relative",
    zIndex: 1,
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },

  brandRow: { display: "flex", alignItems: "center", gap: 12 },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 14,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.22))",
    border: "1px solid rgba(255,255,255,0.28)",
    boxShadow: "0 14px 40px rgba(0,0,0,0.55)",
  },
  brand: { fontWeight: 900, letterSpacing: 0.2 },
  sub: { fontSize: 12, opacity: 0.72 },

  nav: { display: "flex", gap: 14, alignItems: "center" },
  navLink: {
    color: "rgba(255,255,255,0.9)",
    textDecoration: "none",
    fontWeight: 800,
    opacity: 0.85,
  },

  card: {
    borderRadius: 28,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.22)",
    boxShadow:
      "0 34px 90px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.16)",
    backdropFilter: "blur(20px) saturate(155%)",
    WebkitBackdropFilter: "blur(20px) saturate(155%)",
    overflow: "hidden",
    position: "relative",
  },
  cardShine: {
    position: "absolute",
    inset: -90,
    background:
      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.16) 35%, rgba(255,255,255,0.06) 55%, transparent 100%)",
    transform: "translateX(-35%) rotate(8deg)",
    animation: "shineMove 6.5s ease-in-out infinite",
    pointerEvents: "none",
  },
  cardShine2: {
    position: "absolute",
    inset: -60,
    background:
      "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.14), transparent 45%)",
    opacity: 0.8,
    pointerEvents: "none",
  },
  cardInner: { padding: 22, position: "relative" },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 10,
  },

  h1: { margin: 0, fontSize: 30, letterSpacing: -0.5 },
  p: { margin: "6px 0 0", opacity: 0.75, fontSize: 13.5 },

  badgeWrap: { display: "flex", alignItems: "center" },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
  },
  badgeDot: { width: 8, height: 8, borderRadius: 999 },
  badgeText: { fontSize: 12, opacity: 0.9, fontWeight: 800 },

  actions: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 16,
  },

  primaryBtn: {
    position: "relative",
    height: 46,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.24)",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.20))",
    color: "#060606",
    fontWeight: 900,
    letterSpacing: 0.2,
    padding: "0 14px",
    overflow: "hidden",
    boxShadow:
      "0 16px 45px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.55)",
  },
  secondaryBtn: {
    height: 46,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 850,
    padding: "0 14px",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
  },
  btnText: { position: "relative", zIndex: 1 },
  btnGlow: {
    position: "absolute",
    inset: -50,
    background:
      "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.42), transparent 46%)",
    pointerEvents: "none",
  },

  alertErr: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 16,
    background: "rgba(255, 90, 90, 0.12)",
    border: "1px solid rgba(255, 90, 90, 0.24)",
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontSize: 13,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "rgba(255, 90, 90, 0.95)",
    boxShadow: "0 0 0 4px rgba(255, 90, 90, 0.14)",
  },
  alertText: { opacity: 0.95 },

  quickGrid: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 10,
  },
  quickCard: {
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
    padding: 12,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
    minWidth: 0,
  },
  quickLabel: { fontSize: 11, opacity: 0.7, marginBottom: 6 },
  quickValue: {
    fontSize: 13,
    fontWeight: 850,
    opacity: 0.95,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  codeWrap: {
    marginTop: 12,
    borderRadius: 18,
    background: "rgba(0,0,0,0.30)",
    border: "1px solid rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  codeHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.05)",
  },
  codeTitle: { fontSize: 12, fontWeight: 900, opacity: 0.95 },
  codeHint: { fontSize: 12, opacity: 0.65 },
  code: {
    margin: 0,
    padding: 12,
    fontSize: 12.5,
    lineHeight: 1.45,
    color: "rgba(255,255,255,0.92)",
    maxHeight: 260,
    overflow: "auto", // скролл только внутри JSON блока, если много
  },

  smallPrint: {
    marginTop: 12,
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
  },
};
