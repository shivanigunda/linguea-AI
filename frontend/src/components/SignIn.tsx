import React, { useState } from "react";
import { Brain } from "lucide-react";

const API_BASE = "http://localhost:5000";

interface SignInProps {
  onComplete: (userInfo: {
    name: string;
    email: string;
    age: string;
    userUuid: string;
  }) => void;
  onSwitchToLogin: () => void;
  isDarkMode?: boolean;
}

type Step = 1 | 2 | 3;

export function SignIn({ onComplete, onSwitchToLogin, isDarkMode = false }: SignInProps) {
  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const bg = isDarkMode ? "#1C1C1E" : "#F2F2F7";
  const card = isDarkMode ? "#2C2C2E" : "#FFFFFF";
  const inputBg = isDarkMode ? "#3A3A3C" : "#F2F2F7";
  const textPrimary = isDarkMode ? "#FFFFFF" : "#111827";
  const textSecondary = isDarkMode ? "#9CA3AF" : "#6B7280";
  const accent = "#6366F1";
  const accentHover = "#4F46E5";

  const stepLabel = ["What's your name?", "Your email address", "How old are you?"];
  const stepHint = [
    "We'll personalise your experience",
    "To save your progress",
    "So we can set the right difficulty",
  ];
  const stepTotal = 3;

  const canProceed =
    (step === 1 && name.trim().length >= 2) ||
    (step === 2 && email.includes("@") && email.includes(".")) ||
    (step === 3 && Number(age) >= 5 && Number(age) <= 120);

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
    setError("");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), age: Number(age) }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      onComplete({
        name: name.trim(),
        email: email.trim(),
        age,
        userUuid: data.user_uuid,
      });
    } catch {
      setError("Could not reach the server. Is your backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed) handleNext();
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
            LinguaAI
          </h1>
          <p style={{ color: textSecondary, fontSize: 14, marginTop: 4 }}>
            Create your account
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
          {/* Step dots */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28 }}>
            {Array.from({ length: stepTotal }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 6,
                  width: i + 1 === step ? 24 : 6,
                  borderRadius: 3,
                  background: i + 1 <= step ? accent : isDarkMode ? "#3A3A3C" : "#E5E7EB",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Step question */}
          <div style={{ marginBottom: 24, minHeight: 56 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: textPrimary,
                margin: "0 0 4px",
              }}
            >
              {stepLabel[step - 1]}
            </h2>
            <p style={{ color: textSecondary, fontSize: 13, margin: 0 }}>
              {stepHint[step - 1]}
            </p>
          </div>

          {/* Input */}
          {step === 1 && (
            <input
              autoFocus
              type="text"
              placeholder="e.g. Arjun"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle(inputBg, textPrimary, isDarkMode)}
            />
          )}
          {step === 2 && (
            <input
              autoFocus
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle(inputBg, textPrimary, isDarkMode)}
            />
          )}
          {step === 3 && (
            <input
              autoFocus
              type="number"
              placeholder="e.g. 20"
              value={age}
              min={5}
              max={120}
              onChange={(e) => setAge(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle(inputBg, textPrimary, isDarkMode)}
            />
          )}

          {/* Error */}
          {error && (
            <p
              style={{
                color: "#EF4444",
                fontSize: 13,
                marginTop: 8,
                padding: "8px 12px",
                background: isDarkMode ? "rgba(239,68,68,0.1)" : "#FEF2F2",
                borderRadius: 8,
              }}
            >
              {error}
            </p>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {step > 1 && (
              <button
                onClick={handleBack}
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 14,
                  border: `1.5px solid ${isDarkMode ? "#3A3A3C" : "#E5E7EB"}`,
                  background: "transparent",
                  color: textSecondary,
                  fontSize: 15,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed || isLoading}
              style={{
                flex: 2,
                height: 50,
                borderRadius: 14,
                border: "none",
                background: canProceed && !isLoading ? accent : isDarkMode ? "#3A3A3C" : "#E5E7EB",
                color: canProceed && !isLoading ? "#fff" : textSecondary,
                fontSize: 15,
                fontWeight: 600,
                cursor: canProceed && !isLoading ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              {isLoading ? "Creating account..." : step === 3 ? "Get started" : "Continue"}
            </button>
          </div>
        </div>

        {/* Switch to login */}
        <p style={{ textAlign: "center", marginTop: 20, color: textSecondary, fontSize: 14 }}>
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              color: accent,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
              padding: 0,
            }}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}

function inputStyle(bg: string, textColor: string, isDarkMode: boolean): React.CSSProperties {
  return {
    width: "100%",
    height: 52,
    borderRadius: 14,
    border: `1.5px solid ${isDarkMode ? "#3A3A3C" : "#E5E7EB"}`,
    background: bg,
    color: textColor,
    fontSize: 16,
    padding: "0 16px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };
}