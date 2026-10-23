import React, { useState } from "react";
import {
  UserPlus,
  Brain,
  Sparkles,
  GraduationCap,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [staffId, setStaffId] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    // Role validation
    if (!type) {
      alert("Please select an academic role.");
      return;
    }

    const userData = {
      fullName,
      email,
      type,
      staffId,
      contactNo,
      password,
    };

    setIsLoading(true);

    try {
      await axios.post(
        "http://localhost:7000/api/user",
        userData
      );

      alert("Account created successfully!");

      // All academic staff use the lecturer dashboard
      navigate("/lecturer");

    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      alert(errMsg);

    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignIn = () => {
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">

      {/* Background Decorative Elements */}

      <div className="absolute top-20 left-10 opacity-20">
        <Brain className="h-24 w-24 text-indigo-500 animate-pulse" />
      </div>

      <div className="absolute bottom-20 right-10 opacity-20">
        <GraduationCap className="h-28 w-28 text-purple-500 animate-pulse" />
      </div>

      {/* Registration Card */}

      <div className="relative max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-indigo-100">

        {/* Header */}

        <div>

          {/* Logo */}

          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
            <UserPlus className="h-10 w-10 text-white" />
          </div>

          {/* System Label */}

          <div className="flex items-center justify-center gap-2 mt-6">

            <Sparkles className="h-5 w-5 text-purple-500" />

            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              AI Academic Feedback
            </span>

          </div>

          {/* Heading */}

          <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Your Account
          </h2>

          <p className="mt-2 text-center text-sm text-gray-600">
            Register as an academic staff member and access intelligent
            academic feedback tools
          </p>

          {/* Sign In Link */}

          <p className="mt-4 text-center text-sm text-gray-600">

            Already have an account?{" "}

            <button
              onClick={navigateToSignIn}
              className="font-semibold text-indigo-600 hover:text-purple-600 underline transition-colors"
            >
              Sign in here
            </button>

          </p>

        </div>

        {/* Registration Form */}

        <form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit}
        >

          {/* Full Name */}

          <InputField
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            id="fullname"
            placeholder="John Doe"
          />

          {/* Email */}

          <InputField
            label="Email Address"
            value={email}
            onChange={setEmail}
            type="email"
            id="email"
            placeholder="staff@example.com"
          />

          {/* Academic Role */}

          <div className="relative">

            <label
              htmlFor="user-type"
              className="text-xs font-semibold text-indigo-600 uppercase tracking-wide absolute -top-3 left-2 bg-white px-2"
            >
              Academic Role
            </label>

            <div className="relative">

              <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-6 text-indigo-400 pointer-events-none" />

              <select
                id="user-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all bg-white"
              >

                <option value="">
                  -- Select Academic Role --
                </option>

                <option value="instructor">
                  Instructor
                </option>

                <option value="assistant_lecturer">
                  Assistant Lecturer
                </option>

                <option value="lecturer">
                  Lecturer
                </option>

                <option value="senior_lecturer">
                  Senior Lecturer
                </option>

                <option value="professor">
                  Professor
                </option>

              </select>

            </div>

          </div>

          {/* Staff ID */}

          <InputField
            label="Staff ID"
            value={staffId}
            onChange={setStaffId}
            id="staff-id"
            placeholder="e.g. 000111"
          />

          {/* Contact Number */}

          <InputField
            label="Contact Number"
            value={contactNo}
            onChange={setContactNo}
            id="contact"
            placeholder="0771234567"
          />

          {/* Password */}

          <InputField
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
            id="password"
            placeholder="••••••••"
          />

          {/* Confirm Password */}

          <InputField
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            type="password"
            id="confirm-password"
            placeholder="••••••••"
          />

          {/* Terms */}

          <div className="flex items-start">

            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />

            <label
              htmlFor="terms"
              className="ml-2 block text-sm text-gray-700 leading-relaxed"
            >
              I agree to the{" "}

              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-purple-600"
              >
                Terms of Service
              </a>{" "}

              and{" "}

              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-purple-600"
              >
                Privacy Policy
              </a>

            </label>

          </div>

          {/* Create Account Button */}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >

            <span className="absolute left-0 inset-y-0 flex items-center pl-3">

              <UserPlus className="h-5 w-5 text-indigo-100 group-hover:text-white" />

            </span>

            {isLoading
              ? "Creating Account..."
              : "Create Account"}

          </button>

        </form>

        {/* Bottom Information */}

        <div className="pt-5 border-t border-gray-200">

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 text-center">

            <Brain className="h-4 w-4 text-indigo-500 flex-shrink-0" />

            <span>
              AI-powered academic feedback to support effective teaching,
              assessment, and student learning
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
  value,
  onChange,
  id,
  type = "text",
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
        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

    </div>
  );
}