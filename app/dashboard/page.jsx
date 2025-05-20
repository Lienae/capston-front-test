"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("nickname");
    if (savedName) {
      setNickname(savedName);
    }
  }, []);

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h1>🎉 로그인 성공</h1>
      <h2>{nickname} 님, 환영합니다!</h2>
    </div>
  );
}
