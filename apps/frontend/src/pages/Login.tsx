import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, setToken } from "../api/client";
import * as React from "react";

function normalizeError(e: any): string {
  if (!e) return "Ошибка входа";
  if (typeof e === "string") return e;
  if (e?.message && typeof e.message === "string") return e.message;

  // Часто axios/fetch кладут текст сюда
  const maybe =
    e?.response?.data?.detail ||
    e?.response?.data?.message ||
    e?.data?.detail ||
    e?.detail;

  if (typeof maybe === "string") return maybe;
  return "Ошибка входа";
}

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !loading;
  }, [email, password, loading]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      setLoading(true);
      const data = await login(email, password);
      setToken(data.access_token);
      nav("/");
    } catch (e: any) {
      setErr(normalizeError(e));
    } finally {
      setLoading(false);
    }
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
        {/* BRAND */}
        <div style={styles.brandRow}>
          <div style={styles.logo} />
          <div>
            <div style={styles.brand}>AI Assistant</div>
            <div style={styles.sub}>Sign in to continue</div>
          </div>
        </div>

        {/* CARD */}
        <div style={styles.card}>
          {/* liquid shine layers */}
          <div style={styles.cardShine} aria-hidden="true" />
          <div style={styles.cardShine2} aria-hidden="true" />

          <div style={styles.cardInner}>
            <h2 style={styles.h2}>Login</h2>
            <p style={styles.p}>Welcome back 👋</p>

            <form onSubmit={submit} style={styles.form}>
              <label style={styles.label}>
                <span style={styles.labelText}>Email</span>
                <input
                  style={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </label>

              <label style={styles.label}>
                <span style={styles.labelText}>Password</span>
                <input
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                />
              </label>

              <button
                type="submit"
                disabled={!canSubmit}
                style={{
                  ...styles.button,
                  opacity: canSubmit ? 1 : 0.65,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                <span style={styles.buttonText}>
                  {loading ? "Signing in..." : "Login"}
                </span>
                <span style={styles.buttonGlow} aria-hidden="true" />
              </button>
            </form>

            {err && (
              <div style={styles.alertErr} role="alert">
                <span style={styles.alertDot} />
                <span style={styles.alertText}>{err}</span>
              </div>
            )}

            <div style={styles.footerRow}>
              <span style={styles.footerText}>Нет аккаунта?</span>
              <Link to="/register" style={styles.link}>
                Register →
              </Link>
            </div>
          </div>
        </div>

        <div style={styles.smallPrint}>Secure access · Encrypted session</div>
      </div>

      {/* LOCAL “ANIMATIONS” via inline style tricks: hover/focus (works with CSS vars approach) */}
      <style>{`
        /* hover “lift” for the card */
        .glass-card:hover { transform: translateY(-2px); }

        /* focus glow for inputs */
        .glass-input:focus {
          border-color: rgba(255,255,255,0.35) !important;
          box-shadow:
            0 0 0 6px rgba(255,255,255,0.08),
            inset 0 1px 0 rgba(255,255,255,0.10) !important;
          background: rgba(255,255,255,0.08) !important;
        }

        /* button hover */
        .glass-btn:hover {
          transform: translateY(-1px);
          box-shadow:
            0 18px 50px rgba(0,0,0,0.55),
            inset 0 1px 0 rgba(255,255,255,0.55);
        }
        .glass-btn:active { transform: translateY(0px); }

        /* animated shine */
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
    overflow: "hidden", // ключ: никаких скроллов внутри
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
    maxWidth: 460,
    padding: 24, // безопасно, т.к. body overflow hidden
    position: "relative",
    zIndex: 1,
  },

  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 14,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.22))",
    border: "1px solid rgba(255,255,255,0.28)",
    boxShadow: "0 14px 40px rgba(0,0,0,0.55)",
  },
  brand: { fontWeight: 800, letterSpacing: 0.2 },
  sub: { fontSize: 12, opacity: 0.72 },

  card: {
    borderRadius: 26,
    background: "rgba(255,255,255,0.12)", // больше белого
    border: "1px solid rgba(255,255,255,0.22)",
    boxShadow:
      "0 34px 90px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.16)",
    backdropFilter: "blur(20px) saturate(155%)",
    WebkitBackdropFilter: "blur(20px) saturate(155%)",
    overflow: "hidden",
    position: "relative",
    transform: "translateY(0)",
    transition: "transform 160ms ease",
  },

  cardShine: {
    position: "absolute",
    inset: -80,
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

  h2: { margin: 0, fontSize: 28, letterSpacing: -0.4 },
  p: { margin: "6px 0 18px", opacity: 0.75, fontSize: 13.5 },

  form: { display: "grid", gap: 12 },

  label: { display: "grid", gap: 6 },
  labelText: { fontSize: 12, opacity: 0.8 },

  input: {
    height: 44,
    borderRadius: 16,
    padding: "0 12px",
    color: "white",
    background: "rgba(255,255,255,0.05)", // светлее
    border: "1px solid rgba(255,255,255,0.18)",
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    transition: "box-shadow 160ms ease, border-color 160ms ease,_toggle 160ms ease",
  },

  button: {
    position: "relative",
    height: 46,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.24)",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.20))",
    color: "#060606",
    fontWeight: 800,
    letterSpacing: 0.2,
    marginTop: 6,
    overflow: "hidden",
    boxShadow:
      "0 16px 45px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.55)",
    transition: "transform 140ms ease, box-shadow 140ms ease, opacity 140ms ease",
  },
  buttonText: { position: "relative", zIndex: 1 },
  buttonGlow: {
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

  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.14)",
  },
  footerText: { fontSize: 13, opacity: 0.75 },
  link: {
    color: "rgba(255,255,255,0.95)",
    textDecoration: "none",
    fontWeight: 800,
  },

  smallPrint: {
    marginTop: 12,
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
  },
};

// Добавляем классы для hover/focus правил из <style>
(styles.card as any).className = "glass-card";
(styles.input as any).className = "glass-input";
(styles.button as any).className = "glass-btn";
