import React, { useState, useEffect } from "react";
import { SignIn } from "./components/SignIn";
import { Login } from "./components/Login";
import { LanguageSelection } from "./components/LanguageSelection";
import { PronunciationPractice } from "./components/PronunciationPractice";
import Learninggoal from "./components/Learninggoal";

const API_BASE = "http://localhost:5000";

export type Page =
  | "loading"
  | "sign-in"
  | "login"
  | "language-selection"
  | "learninggoal"
  | "pronunciation";

export interface UserInfo {
  name: string;
  email: string;
  age: string;
  userUuid: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("loading");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ── On mount: check localStorage for existing session ──
  useEffect(() => {
    const savedUuid = localStorage.getItem("user_uuid");

    if (!savedUuid) {
      // No session at all → show sign-in
      setCurrentPage("sign-in");
      return;
    }

    // UUID found → verify it with the backend
    fetch(`${API_BASE}/verify-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_uuid: savedUuid }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid session");
        return res.json();
      })
      .then((data) => {
        // Valid session → auto-login, go straight to learning goal
        setUserInfo({
          name: data.name,
          email: data.email,
          age: data.age,
          userUuid: data.user_uuid,
        });

        // Restore saved language if available
        const savedLanguage = localStorage.getItem("selected_language");
        if (savedLanguage) setSelectedLanguage(savedLanguage);

        setCurrentPage("learninggoal");
      })
      .catch(() => {
        // UUID invalid or DB error → clear stale session, show sign-in
        localStorage.removeItem("user_uuid");
        localStorage.removeItem("selected_language");
        setCurrentPage("sign-in");
      });
  }, []);

  // ── Called after successful signup ──
  const handleSignUpComplete = (info: UserInfo) => {
    localStorage.setItem("user_uuid", info.userUuid);
    setUserInfo(info);
    setCurrentPage("language-selection");
  };

  // ── Called after successful login ──
  const handleLoginComplete = (info: UserInfo) => {
    localStorage.setItem("user_uuid", info.userUuid);
    const savedLanguage = localStorage.getItem("selected_language");
    if (savedLanguage) setSelectedLanguage(savedLanguage);
    setUserInfo(info);
    setCurrentPage("learninggoal");
  };

  // ── Called when language is selected ──
  const handleLanguageSelect = (language: string) => {
    localStorage.setItem("selected_language", language);
    setSelectedLanguage(language);
    setCurrentPage("learninggoal");
  };

  // ── Logout: clear session and go back to sign-in ──
  const handleLogout = () => {
    localStorage.removeItem("user_uuid");
    localStorage.removeItem("selected_language");
    setUserInfo(null);
    setCurrentPage("sign-in");
  };

  // ── Loading splash while verifying session ──
  if (currentPage === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDarkMode ? "#1C1C1E" : "#F2F2F7",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              margin: "0 auto 16px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <p style={{ color: isDarkMode ? "#9CA3AF" : "#6B7280", fontSize: 14 }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ── Sign-up page (new users) ──
  if (currentPage === "sign-in") {
    return (
      <SignIn
        onComplete={handleSignUpComplete}
        onSwitchToLogin={() => setCurrentPage("login")}
        isDarkMode={isDarkMode}
      />
    );
  }

  // ── Login page (returning users) ──
  if (currentPage === "login") {
    return (
      <Login
        onComplete={handleLoginComplete}
        onSwitchToSignUp={() => setCurrentPage("sign-in")}
        isDarkMode={isDarkMode}
      />
    );
  }

  // ── Language selection (first time after signup) ──
  if (currentPage === "language-selection") {
    return (
      <LanguageSelection
        onBack={() => setCurrentPage("sign-in")}
        onLanguageSelect={handleLanguageSelect}
        isDarkMode={isDarkMode}
      />
    );
  }

  // ── Learning goal ──
  if (currentPage === "learninggoal") {
    return (
      <Learninggoal
        isDarkMode={isDarkMode}
        userInfo={userInfo}
        onNavigate={(page: Page) => setCurrentPage(page)}
        onLogout={handleLogout}
      />
    );
  }

  // ── Pronunciation practice ──
  if (currentPage === "pronunciation") {
    return (
      <PronunciationPractice
        onBack={() => setCurrentPage("learninggoal")}
        language={selectedLanguage}
        userUuid={userInfo?.userUuid ?? ""}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((d) => !d)}
      />
    );
  }

  return null;
}
