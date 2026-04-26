import { useState } from "react";
import { useLocation } from "wouter";

const C = {
  bg: "#FAF7F2",
  card: "#F2EDE4",
  border: "#D4C5A9",
  text: "#2C1A0E",
  textMid: "#5C3D20",
  muted: "#8B7355",
  accent: "#B8860B",
  accentHover: "#9A7009",
  white: "#FDFCF9",
};

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      // Login successful - store admin session in localStorage for dashboard access
      localStorage.setItem("admin_session", JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name || data.user.email,
        loggedInAt: Date.now(),
      }));
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: C.bg }}>
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-8"
        style={{ background: C.white, border: `1px solid ${C.border}` }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl mb-2" style={{ color: C.text, fontWeight: 500 }}>
            Admin Login
          </h1>
          <p style={{ color: C.muted, fontSize: "0.95rem" }}>
            Sign in with your email and password to access the admin dashboard
          </p>
        </div>

        {/* Info Box */}
        <div
          className="p-4 rounded mb-8"
          style={{ background: `${C.accent}10`, border: `1px solid ${C.accent}50` }}
        >
          <p style={{ color: C.textMid, fontSize: "0.9rem", lineHeight: "1.5" }}>
            Only authorized administrators can access the dashboard. If you don't have admin access, please contact the system administrator.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="p-3 rounded mb-6"
            style={{ background: "#ff6b6b20", border: "1px solid #ff6b6b50", color: "#c92a2a" }}
          >
            <p style={{ fontSize: "0.9rem" }}>{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: C.text,
                fontWeight: 500,
                fontSize: "0.9rem",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@amusicva.com"
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `1px solid ${C.border}`,
                borderRadius: "0.375rem",
                fontSize: "1rem",
                color: C.text,
                background: C.white,
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: C.text,
                fontWeight: 500,
                fontSize: "0.9rem",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: `1px solid ${C.border}`,
                borderRadius: "0.375rem",
                fontSize: "1rem",
                color: C.text,
                background: C.white,
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: C.accent,
              color: C.white,
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: isLoading || !email || !password ? "not-allowed" : "pointer",
              opacity: isLoading || !email || !password ? 0.7 : 1,
              transition: "opacity 0.2s, background 0.2s",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => {
              if (!isLoading && email && password) {
                e.currentTarget.style.background = C.accentHover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.accent;
            }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            style={{
              color: C.accent,
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
