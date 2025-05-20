"use client";
import { useEffect, useState } from "react";
import "../styles/AnimatedForm.css";

export default function Home() {
  const [nicknameError, setNicknameError] = useState([]);
  const [idError, setIdError] = useState([]);
  const [passwordError, setPasswordError] = useState([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState([]);

  useEffect(() => {
    const switchers = [...document.querySelectorAll(".switcher")];
    switchers.forEach((item) => {
      item.addEventListener("click", function () {
        switchers.forEach((btn) =>
          btn.parentElement.classList.remove("is-active")
        );
        this.parentElement.classList.add("is-active");
      });
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const id = document.getElementById("login-id").value;
    const password = document.getElementById("login-password").value;

    const formData = new URLSearchParams();
    formData.append("id", id);
    formData.append("pwd", password);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
        credentials: "include",
      });

      const result = await response.text();
      if (response.ok) {
        console.log("로그인 성공:", result);
        localStorage.setItem("nickname", result);
        window.location.href = "/dashboard";
      } else {
        console.log("로그인 실패:", result);
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

const handleSignup = async (e) => {
  e.preventDefault();

  // 기존 에러 초기화
  setNicknameError([]);
  setIdError([]);
  setPasswordError([]);
  setConfirmPasswordError([]);

  const nickname = document.getElementById("signup-nickname").value;
  const id = document.getElementById("signup-id").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-password-confirm").value;

  try {
    const response = await fetch("http://localhost:8080/api/v1/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: id,
        userPassword: password,
        confirmPassword: confirm,
        nickname,
      }),
    });

    if (!response.ok) {
      const errorJson = await response.json();
      console.log("유효성 에러:", errorJson);

      // 1. 필드별 유효성 Map 형태
      if (typeof errorJson === "object" && !Array.isArray(errorJson)) {
        if (errorJson.nickname) {
          setNicknameError(Array.isArray(errorJson.nickname) ? errorJson.nickname : [errorJson.nickname]);
        }
        if (errorJson.userId) {
          setIdError(Array.isArray(errorJson.userId) ? errorJson.userId : [errorJson.userId]);
        }
        if (errorJson.userPassword) {
          setPasswordError(Array.isArray(errorJson.userPassword) ? errorJson.userPassword : [errorJson.userPassword]);
        }
        if (errorJson.confirmPassword) {
          setConfirmPasswordError(Array.isArray(errorJson.confirmPassword) ? errorJson.confirmPassword : [errorJson.confirmPassword]);
        }

        // 2. 단일 message 키만 존재할 경우 (GlobalExceptionHandler 방식)
        else if (errorJson.message) {
          const msg = errorJson.message;

          if (msg.includes("닉네임")) {
            setNicknameError([msg]);
          } else if (msg.includes("아이디")) {
            setIdError([msg]);
          } else if (msg.includes("비밀번호 확인") || msg.includes("확인")) {
            setConfirmPasswordError([msg]);
          } else if (msg.includes("비밀번호")) {
            setPasswordError([msg]);
          } else {           
            alert("몰루?: " + msg);
          }
        }
      }

      return;
    }

    // 성공 처리
    const result = await response.text();
    alert(result || "회원가입 성공!");
  } catch (error) {
    console.error("네트워크 또는 서버 오류:", error);
    alert("서버 통신 중 오류가 발생했습니다.");
  }
};

  return (
    <section className="forms-section">
      <h1 className="section-title">Maple</h1>
      <div className="forms">
        {/* 로그인 */}
        <div className="form-wrapper is-active">
          <button type="button" className="switcher switcher-login">
            Login <span className="underline"></span>
          </button>
          <form className="form form-login" onSubmit={handleLogin}>
            <fieldset>
              <legend>ID와 비밀번호를 입력하세요.</legend>
              <div className="input-block">
                <label htmlFor="login-id">ID</label>
                <input id="login-id" type="text" required />
              </div>
              <div className="input-block">
                <label htmlFor="login-password">Password</label>
                <input id="login-password" type="password" required />
              </div>
            </fieldset>
            <button type="submit" className="submit-button btn-login">
              Login
            </button>
          </form>
        </div>

        {/* 회원가입 */}
        <div className="form-wrapper">
          <button type="button" className="switcher switcher-signup">
            Sign Up <span className="underline"></span>
          </button>
          <form className="form form-signup" onSubmit={handleSignup}>
            <fieldset>
              <legend>닉네임, ID, 비밀번호를 입력하세요.</legend>
              <div className="input-block">
              <label htmlFor="signup-nickname">Nickname</label>
              <input id="signup-nickname" type="text" required />
              {nicknameError.map((msg, i) => (
                <div key={i} style={{ color: "red", fontSize: "0.9rem" }}>
                  {msg}
                </div>
              ))}
            </div>

            <div className="input-block">
              <label htmlFor="signup-id">ID</label>
              <input id="signup-id" type="text" required />
              {idError.map((msg, i) => (
                <div key={i} style={{ color: "red", fontSize: "0.9rem" }}>
                  {msg}
                </div>
              ))}
            </div>

            <div className="input-block">
              <label htmlFor="signup-password">Password</label>
              <input id="signup-password" type="password" required />
              {passwordError.map((msg, i) => (
                <div key={i} style={{ color: "red", fontSize: "0.9rem" }}>
                  {msg}
                </div>
              ))}
            </div>

            <div className="input-block">
              <label htmlFor="signup-password-confirm">Confirm Password</label>
              <input id="signup-password-confirm" type="password" required />
              {confirmPasswordError.map((msg, i) => (
                <div key={i} style={{ color: "red", fontSize: "0.9rem" }}>
                {msg}
                </div>
              ))}
            </div>
            </fieldset>

            <button type="submit" className="submit-button btn-signup">
              Continue
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
