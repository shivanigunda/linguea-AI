import React, { useState } from "react";
import { Brain } from "lucide-react";

const API_BASE = "http://localhost:5000";

interface LoginProps {
  onComplete: (userInfo: {
    name: string;
    email: string;
    age: string;
    userUuid: string;
  }) => void;
  onSwitchToSignUp: () => void;
  isDarkMode?: boolean;
}

export function Login({ onComplete, onSwitchToSignUp, isDarkMode = false }: LoginProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const bg = isDarkMode ? "#1C1C1E" : "#F2F2F7";
  const card = isDarkMode ? "#2C2C2E" : "#FFFFFF";
  const inputBg = isDarkMode ? "#3A3A3C" : "#F2F2F7";
  const textPrimary = isDarkMode ? "#FFFFFF" : "#111827";
  const textSecondary = isDarkMode ? "#9CA3AF" : "#6B7280";
  const accent = "#6366F1";

  const isValidEmail = email.includes("@") && email.includes(".");

  const handleLogin = async () => {
    if (!isValidEmail) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.status === 404) {
        setError("No account found with this email. Please sign up first.");
        setIsLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      onComplete({
        name: data.name,
        email: data.email,
        age: data.age,
        userUuid: data.user_uuid,
      });
    } catch {
      setError("Could not reach the server. Is your backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValidEmail) handleLogin();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        transition: "background 0.3s",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #818cf8, #6366f1, #4f46e5)",
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Brain size={36} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: textPrimary, margin: 0 }}>
            Welcome back
          </h1>
          <p style={{ color: textSecondary, fontSize: 14, marginTop: 4 }}>
            Enter your email to continue
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: card,
            borderRadius: 24,
            padding: "32px 28px",
            boxShadow: isDarkMode
              ? "0 20px 60px rgba(0,0,0,0.5)"
              : "0 20px 60px rgba(0,0,0,0.08)",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: textSecondary,
              marginBottom: 8,
            }}
          >
            Email address
          </label>
          <input
            autoFocus
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 14,
              border: `1.5px solid ${
                error
                  ? "#EF4444"
                  : isDarkMode
                  ? "#3A3A3C"
                  : "#E5E7EB"
              }`,
              background: inputBg,
              color: textPrimary,
              fontSize: 16,
              padding: "0 16px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
          />

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: isDarkMode ? "rgba(239,68,68,0.1)" : "#FEF2F2",
                color: "#EF4444",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {error}
              {error.includes("sign up") && (
                <>
                  {" "}
                  <button
                    onClick={onSwitchToSignUp}
                    style={{
                      background: "none",
                      border: "none",
                      color: accent,
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0,
                      fontSize: 13,
                    }}
                  >
                    Create one now
                  </button>
                </>
              )}
            </div>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={!isValidEmail || isLoading}
            style={{
              width: "100%",
              height: 52,
              marginTop: 16,
              borderRadius: 14,
              border: "none",
              background:
                isValidEmail && !isLoading
                  ? accent
                  : isDarkMode
                  ? "#3A3A3C"
                  : "#E5E7EB",
              color:
                isValidEmail && !isLoading
                  ? "#fff"
                  : textSecondary,
              fontSize: 16,
              fontWeight: 600,
              cursor: isValidEmail && !isLoading ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              letterSpacing: "0.01em",
            }}
          >
            {isLoading ? "Signing in..." : "Continue"}
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: isDarkMode ? "#3A3A3C" : "#E5E7EB" }} />
            <span style={{ color: textSecondary, fontSize: 12 }}>or</span>
            <div style={{ flex: 1, height: 1, background: isDarkMode ? "#3A3A3C" : "#E5E7EB" }} />
          </div>

          {/* Sign up link */}
          <button
            onClick={onSwitchToSignUp}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 14,
              border: `1.5px solid ${isDarkMode ? "#3A3A3C" : "#E5E7EB"}`,
              background: "transparent",
              color: textPrimary,
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Create a new account
          </button>
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            color: textSecondary,
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          Your session is saved automatically.
          <br />
          You won't need to log in again on this device.
        </p>
      </div>
    </div>
  );
}