"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Error from "next/error";

interface ApiError extends Error {
  message: string;
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email: loginCredentials.email,
        password: loginCredentials.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciales inválidas");
        return;
      }

      if (result?.ok) {
        window.location.href = "/posts";
      }
    } catch (error) {
      setError("Ocurrió un error al iniciar sesión");
      console.error("Error en login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear usuario");
      }
      const result = await signIn("credentials", {
        email: registerData.email,
        password: registerData.password,
        redirect: false,
      });

      if (result?.ok) {
        window.location.href = "/posts";
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        const apiError = error as ApiError;
        setError(apiError.message || "Error al registrar usuario");
      } else {
        setError("Error al registrar usuario");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === "login"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("login");
              setError("");
            }}
          >
            Iniciar sesión
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === "register"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("register");
              setError("");
            }}
          >
            Registrarse
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={loginCredentials.email}
                  onChange={(e) =>
                    setLoginCredentials({
                      ...loginCredentials,
                      email: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="usuario@ejemplo.com"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginCredentials.password}
                  onChange={(e) =>
                    setLoginCredentials({
                      ...loginCredentials,
                      password: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="register-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  id="register-name"
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tu nombre"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="register-email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="usuario@ejemplo.com"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar Contraseña
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  required
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
