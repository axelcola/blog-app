"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Error from "next/error";

interface ApiError extends Error {
  message: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

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

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateLoginForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!loginCredentials.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(loginCredentials.email)) {
      newErrors.email = "The email format is not valid";
      isValid = false;
    }
    
    if (!loginCredentials.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateRegisterForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!registerData.name || registerData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
      isValid = false;
    }

    if (!registerData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(registerData.email)) {
      newErrors.email = "The email format is not valid";
      isValid = false;
    }

    if (!registerData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!validatePassword(registerData.password)) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await signIn("credentials", {
        email: loginCredentials.email,
        password: loginCredentials.password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({
          password: "Email or password is incorrect"
        });
        return;
      }

      if (result?.ok) {
        window.location.href = "/posts";
      }
    } catch (error) {
      setErrors({
        password: "Connection error. Please try again later"
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    setIsLoading(true);
    setErrors({});

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
        if (response.status === 409) {
          setErrors({ email: "This email is already registered" });
          return;
        }
        throw new Error(data.error || "Error creating user");
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
        setErrors({
          password: apiError.message || "Error registering user. Please try again later"
        });
      } else {
        setErrors({
          password: "Connection error. Please try again later"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderFieldError = (fieldName: keyof ValidationErrors) => {
    if (errors[fieldName]) {
      return (
        <p className="mt-1 text-sm text-red-600">
          {errors[fieldName]}
        </p>
      );
    }
    return null;
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
              setErrors({});
            }}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === "register"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("register");
              setErrors({});
            }}
          >
            Sign Up
          </button>
        </div>

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
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="user@example.com"
                  disabled={isLoading}
                />
                {renderFieldError('email')}
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
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
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {renderFieldError('password')}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in..." : "Sign In"}
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
                  Name
                </label>
                <input
                  id="register-name"
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Your name"
                  disabled={isLoading}
                />
                {renderFieldError('name')}
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
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="user@example.com"
                  disabled={isLoading}
                />
                {renderFieldError('email')}
              </div>
              <div>
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
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
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {renderFieldError('password')}
              </div>
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
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
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {renderFieldError('confirmPassword')}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}