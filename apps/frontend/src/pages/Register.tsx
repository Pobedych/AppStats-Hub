import { useMemo, useState } from "react";
import { apiPostJson } from "../api/client";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pwScore = useMemo(() => {
    // простой скоринг: длина + разнообразие
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(s, 5);
  }, [password]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (password.length < 8) return setErr("Пароль минимум 8 символов");
    if (password !== password2) return setErr("Пароли не совпадают");

    try {
      setLoading(true);
      await apiPostJson("/auth/register", {
        email,
        username: username.trim() || null,
        password,
      });
      setOk("Аккаунт создан ✅");
      setTimeout(() => nav("/login"), 700);
    } catch (e: any) {
      setErr(e?.message ?? "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.bg} aria-hidden="true">
        <div style={styles.noise} />
        <div style={styles.orb1} />
        <div style={styles.orb2} />
        <div style={styles.grid} />
      </div>

      <div style={styles.shell}>
        <div style={styles.brandRow}>
          <div style={styles.logo} />
          <div>
            <div style={styles.brand}>AI Assistant</div>
            <div style={styles.sub}>Create your account</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardInner}>
            <h2 style={styles.h2}>Register</h2>
            <p style={styles.p}>Welcome. Let’s get you set up.</p>

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
                <span style={styles.labelText}>Username (optional)</span>
                <input
                  style={styles.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="alexey"
                  autoComplete="username"
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
                  autoComplete="new-password"
                />

                <div style={styles.meterWrap}>
                  <div style={styles.meterTrack}>
                    <div
                      style={{
                        ...styles.meterFill,
                        width: `${(pwScore / 5) * 100}%`,
                        opacity: password.length ? 1 : 0,
                      }}
                    />
                  </div>
                  <span style={styles.meterText}>
                    {password.length === 0
                      ? ""
                      : pwScore <= 2
                      ? "weak"
                      : pwScore === 3
                      ? "ok"
                      : "strong"}
                  </span>
                </div>
              </label>

              <label style={styles.label}>
                <span style={styles.labelText}>Repeat password</span>
                <input
                  style={styles.input}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                />
              </label>

              <button
                type="submit"
                style={{
                  ...styles.button,
                  opacity: loading ? 0.75 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create account"}
                <span style={styles.buttonGlow} aria-hidden="true" />
              </button>
            </form>

            {err && (
              <div style={styles.alertErr} role="alert">
                <span style={styles.alertDot} />
                <span>{err}</span>
              </div>
            )}

            {ok && (
              <div style={styles.alertOk} role="status">
                <span style={styles.alertDotOk} />
                <span>{ok}</span>
              </div>
            )}

            <div style={styles.footerRow}>
              <span style={styles.footerText}>Уже есть аккаунт?</span>
              <Link to="/login" style={styles.link}>
                Login →
              </Link>
            </div>
          </div>
        </div>

        <div style={styles.smallPrint}>
          By continuing you agree to basic terms & privacy.
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    position: "relative",
    overflow: "hidden",
    color: "white",
    padding: 24,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
  },

  // Background: ч/б, сетка, “orbs” (монохромные), noise
  bg: { position: "absolute", inset: 0, background: "#070707" },
  grid: {
    position: "absolute",
    inset: -2,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
    backgroundSize: "44px 44px",
    maskImage:
      "radial-gradient(ellipse at center, black 0%, rgba(0,0,0,0.8) 45%, transparent 70%)",
    opacity: 0.55,
  },
  noise: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
    opacity: 0.08,
    mixBlendMode: "overlay",
    pointerEvents: "none",
  },
  orb1: {
    position: "absolute",
    width: 520,
    height: 520,
    left: "-10%",
    top: "-20%",
    borderRadius: 999,
    background:
      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 60%)",
    filter: "blur(10px)",
    opacity: 0.7,
  },
  orb2: {
    position: "absolute",
    width: 620,
    height: 620,
    right: "-18%",
    bottom: "-25%",
    borderRadius: 999,
    background:
      "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.18), transparent 62%)",
    filter: "blur(12px)",
    opacity: 0.75,
  },

  shell: {
    width: "100%",
    maxWidth: 460,
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
    width: 36,
    height: 36,
    borderRadius: 12,
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.18))",
    boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
    border: "1px solid rgba(255,255,255,0.22)",
  },
  brand: { fontWeight: 700, letterSpacing: 0.2 },
  sub: { fontSize: 12, opacity: 0.7 },

  // Liquid glass card
  card: {
    borderRadius: 24,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow:
      "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px) saturate(140%)",
    WebkitBackdropFilter: "blur(18px) saturate(140%)",
    overflow: "hidden",
  },
  cardInner: {
    padding: 22,
    position: "relative",
  },

  h2: { margin: 0, fontSize: 26, letterSpacing: -0.3 },
  p: { margin: "6px 0 16px", opacity: 0.72, fontSize: 13.5 },

  form: { display: "grid", gap: 12 },

  label: { display: "grid", gap: 6 },
  labelText: { fontSize: 12, opacity: 0.78 },

  input: {
    height: 42,
    borderRadius: 14,
    padding: "0 12px",
    color: "white",
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.14)",
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
  },

  meterWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  meterTrack: {
    height: 6,
    borderRadius: 999,
    flex: 1,
    background: "rgba(255,255,255,0.12)",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  meterFill: {
    height: "100%",
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.95))",
    boxShadow: "0 6px 18px rgba(255,255,255,0.12)",
    transition: "width 160ms ease",
  },
  meterText: { fontSize: 12, opacity: 0.65, width: 52, textAlign: "right" },

  button: {
    position: "relative",
    height: 44,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.20)",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.16))",
    color: "#060606",
    fontWeight: 700,
    letterSpacing: 0.2,
    marginTop: 6,
    overflow: "hidden",
    boxShadow:
      "0 18px 45px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.40)",
  },
  buttonGlow: {
    position: "absolute",
    inset: -40,
    background:
      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 45%)",
    transform: "translateZ(0)",
    pointerEvents: "none",
  },

  alertErr: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 14,
    background: "rgba(255, 77, 77, 0.12)",
    border: "1px solid rgba(255, 77, 77, 0.22)",
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontSize: 13,
  },
  alertOk: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 14,
    background: "rgba(120, 255, 188, 0.10)",
    border: "1px solid rgba(120, 255, 188, 0.22)",
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontSize: 13,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "rgba(255, 77, 77, 0.9)",
    boxShadow: "0 0 0 4px rgba(255, 77, 77, 0.12)",
  },
  alertDotOk: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "rgba(120, 255, 188, 0.95)",
    boxShadow: "0 0 0 4px rgba(120, 255, 188, 0.12)",
  },

  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.12)",
  },
  footerText: { fontSize: 13, opacity: 0.72 },
  link: {
    color: "rgba(255,255,255,0.92)",
    textDecoration: "none",
    fontWeight: 700,
  },

  smallPrint: {
    marginTop: 12,
    fontSize: 12,
    opacity: 0.55,
    textAlign: "center",
  },
};
