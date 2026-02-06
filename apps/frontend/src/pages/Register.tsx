// frontend/src/pages/Register.tsx
import { useState } from "react";
import { apiPost } from "../api/client";

type UserRead = {
    id: string;
    email: string;
    username?: string | null;
    is_active: boolean;
    is_superuser: boolean;
    created_at: string;
};

export default function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    function validate(): string | null {
        if (!email.trim()) return "Введите email";
        if (!email.includes("@")) return "Проверь email";
        if (username && username.length > 50) return "Username слишком длинный (max 50)";
        if (password.length < 8) return "Пароль минимум 8 символов";
        if (password !== password2) return "Пароли не совпадают";
        return null;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                email: email.trim(),
                username: username.trim() || null,
                password,
            };
            const user = await apiPost<UserRead>("/auth/register", payload);
            setSuccess(`Пользователь создан: ${user.email}`);
            // Вариант: редирект на /login
            // window.location.href = "/login";
            setEmail("");
            setUsername("");
            setPassword("");
            setPassword2("");
        } catch (err: any) {
            setError(err?.message ?? "Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
            <h1 style={{ marginBottom: 12 }}>Регистрация</h1>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
                <label style={{ display: "grid", gap: 6 }}>
                    <span>Email</span>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                    />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                    <span>Username (необязательно)</span>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="alex"
                        autoComplete="username"
                    />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                    <span>Пароль</span>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        autoComplete="new-password"
                    />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                    <span>Повтори пароль</span>
                    <input
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        type="password"
                        autoComplete="new-password"
                    />
                </label>

                {error && (
                    <div style={{ padding: 10, border: "1px solid", borderRadius: 8 }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{ padding: 10, border: "1px solid", borderRadius: 8 }}>
                        {success}
                    </div>
                )}

                <button disabled={loading} type="submit" style={{ padding: 10 }}>
                    {loading ? "Создаю..." : "Создать аккаунт"}
                </button>
            </form>
        </div>
    );
}
