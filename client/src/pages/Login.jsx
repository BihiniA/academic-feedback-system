import React, { useState } from "react";
import {
  LogIn,
  Brain,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Admin credentials
  const adminEmail = "admin@admin.com";
  const adminPassword = "adminAA@123";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    // Admin login
    if (email === adminEmail && password === adminPassword) {
      alert("Welcome, Admin!");
      navigate("/admin");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:7000/api/user/login",
        {
          email,
          password,
        }
      );

      const user = response.data;

      alert(`Welcome, ${user.fullName}!`);

      // Academic user roles
      switch (user.type) {

        case "lecturer":
          navigate("/admin");
          break;

        default:
          navigate("/");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";

      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">

      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 opacity-20">
        <Brain className="h-24 w-24 text-indigo-500 animate-pulse" />
      </div>

      <div className="absolute bottom-20 right-10 opacity-20">
        <GraduationCap className="h-28 w-28 text-purple-500 animate-pulse" />
      </div>

      {/* Login Card */}
      <div className="relative max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-indigo-100">

        {/* Logo */}
        <div>
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
            <Brain className="h-10 w-10 text-white" />
          </div>

          {/* System Name */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Sparkles className="h-5 w-5 text-purple-500" />

            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              AI Academic Feedback
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your personalized academic feedback
          </p>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={navigateToSignUp}
              className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors duration-300 underline underline-offset-2"
            >
              Create an account
            </button>
          </p>
        </div>

        {/* Login Form */}
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >

          <div className="space-y-5">

            <InputField
              label="Email Address"
              id="email-address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="student@example.com"
            />

            <InputField
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />

          </div>

          {/* Remember Me / Forgot Password */}
          <div className="flex items-center justify-between">

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />

              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <button
              type="button"
              className="text-sm font-medium text-indigo-600 hover:text-purple-600 transition-colors"
            >
              Forgot password?
            </button>

          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            onClick={() => navigate("/admin")}
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >

            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LogIn className="h-5 w-5 text-indigo-100 group-hover:text-white" />
            </span>

            {isLoading ? "Signing in..." : "Sign In"}

          </button>

        </form>

        {/* Bottom Information */}
        <div className="pt-5 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Brain className="h-4 w-4 text-indigo-500" />

            <span>
              Intelligent feedback for better academic performance
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}


/* Reusable Input Component */
function InputField({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="relative">

      <label
        htmlFor={id}
        className="text-xs font-semibold text-indigo-600 uppercase tracking-wide absolute -top-3 left-2 bg-white px-2"
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        required
        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

    </div>
  );
}