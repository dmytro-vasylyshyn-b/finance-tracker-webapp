import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Перевірка на правильність формату email або телефону
const schema = yup.object().shape({
  identifier: yup
    .string()
    .required("Введіть email або номер телефону")
    .test("is-valid", "Невірний формат", value =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\+?\d{10,15}$/.test(value)
    ),
  password: yup.string().required("Пароль обов'язковий").min(6, "Мінімум 6 символів"),
  confirmPassword: yup
    .string()
    .when("password", {
      is: (val) => val && val.length > 0,
      then: yup.string().oneOf([yup.ref("password")], "Паролі повинні співпадати"),
    })
    .required("Підтвердження паролю обов'язкове"),
});

export default function AuthForm({ theme, toggleTheme }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
        console.log("Форма відправлена!", data);
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      console.log("Форма відправлена!", data);
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
            firstName: "Ім'я",  // Можна замінити на дані, що введені користувачем
            lastName: "Прізвище", // Можна замінити на дані, що введені користувачем
          };

      const response = await axios.post(endpoint, payload);
      localStorage.setItem("token", response.data); // Зберігаємо токен
      navigate("/"); // Редірект на головну сторінку після успішного входу
    } catch (err) {
      setError(err.response?.data?.message || "Помилка авторизації");
    }
  };

  return (
    <div className={`max-w-md mx-auto mt-10 p-6 border rounded shadow ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? t("login") : t("register")}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">{t("email_or_phone")}</label>
          <input
            type="text"
            {...register("identifier")}
            className="w-full p-2 border rounded"
            placeholder={t("email_placeholder")}
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm">{errors.identifier.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">{t("password")}</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 border rounded"
            placeholder={t("password_placeholder")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Поле підтвердження паролю для реєстрації */}
        {!isLogin && (
          <div>
            <label className="block mb-1">{t("confirm_password")}</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full p-2 border rounded"
              placeholder={t("confirm_password_placeholder")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isLogin ? t("login_button") : t("register_button")}
        </button>
      </form>

      <p className="text-center mt-4">
        {isLogin ? t("no_account") : t("already_account")}{" "}
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? t("register_button") : t("login_button")}
        </button>
      </p>
    </div>
  );
}
