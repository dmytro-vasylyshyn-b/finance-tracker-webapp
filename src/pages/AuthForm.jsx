import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../api/axios";
import './css/AuthForm.css'


export default function AuthForm({ theme, toggleTheme }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();


  const loginSchema = yup.object({
    identifier: yup
      .string()
      .required(t("identifier_required"))
      .test("is-valid", t("identifier_invalid"), (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\+?\d{10,15}$/.test(value)
      ),
    password: yup
      .string()
      .required(t("password_required"))
      .min(6, t("password_min")),
  });
  
  const registerSchema = loginSchema.shape({
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], t("confirm_password_mismatch"))
      .required(t("confirm_password_required")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isLogin ? loginSchema : registerSchema),
  });

  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "uk" : "en");
  };

  const onSubmit = async (data) => {
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? {
            email: data.identifier.includes("@") ? data.identifier : undefined,
            password: data.password,
          }
        : {
            email: data.identifier.includes("@") ? data.identifier : undefined,
            phoneNumber: !data.identifier.includes("@") ? data.identifier : undefined,
            password: data.password,
            confirmPassword: data.confirmPassword,
            firstName: "Ім'я",
            lastName: "Прізвище",
          };
  
      const response = await axios.post(endpoint, payload);
      console.log("Saved token:", response.data.token);
      localStorage.setItem("token", response.data.token);
      console.log("Saved token:", localStorage.getItem("token"));
      navigate("/");
      window.location.reload();
    } catch (err) {
      const errorKey = err.response?.data?.message;
      const fallback = isLogin ? t("invalid_credentials") : t("invalid_credentials");
  
      setError(t(`errors.${errorKey}`) || fallback);
    }
  };

  return (
    <div className={`auth-page ${theme}`}>
      <div className={`auth-form-container ${theme}`}>
        <h2>{isLogin ? t("login") : t("register")}</h2>
  
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              {...register("identifier")}
              placeholder={t("email_placeholder")}
              className={theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-black"}
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
            )}
          </div>
  
          <div>
            <input
              type="password"
              {...register("password")}
              placeholder={t("password_placeholder")}
              className={theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-black"}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
  
          {!isLogin && (
            <div>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder={t("confirm_password_placeholder")}
                className={theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-black"}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}
  
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
  
          <div className="switchers">
            <button type="button" onClick={changeLanguage}>
              🌐 {i18n.language === "en" ? "Українська" : "English"}
            </button>
            <button type="button" onClick={toggleTheme}>
              {theme === "dark" ? "☀️ " + t("switch_to_light") : "🌙"+ t("switch_to_dark")}
            </button>
          </div>
  
          <button type="submit" className="submit-btn">
            {isLogin ? t("login") : t("register")}
          </button>
        </form>
  
        <div className="switch-text">
          {isLogin ? t("no_account") : t("already_account")}{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? t("register") : t("login")}
          </button>
        </div>
      </div>
    </div>
  );  
}
