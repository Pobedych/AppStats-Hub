export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        background: "#f5f7fa",
      }}
    >
      <h1 style={{ fontSize: 40 }}>📊 Statistics</h1>

      <p style={{ fontSize: 18, color: "#555", maxWidth: 500, textAlign: "center" }}>
        Добро пожаловать!
        Это главная страница проекта статистики приложений.
      </p>

      <button
        style={{
          marginTop: 20,
          padding: "12px 24px",
          fontSize: 16,
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: "#4f46e5",
          color: "white",
        }}
        onClick={() => alert("Фронт работает ✅")}
      >
        Проверить
      </button>
    </div>
  );
}
