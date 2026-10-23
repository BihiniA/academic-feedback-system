import { useState } from "react";
import {
  Brain,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">

              <div className="p-2 bg-indigo-800/70 rounded-lg group-hover:bg-indigo-700 transition-all duration-200">
                <Brain className="h-8 w-8 text-blue-300 group-hover:text-white transition-colors duration-200" />
              </div>

              <div className="ml-3">
                <span className="text-2xl font-bold tracking-tight">
                  AI Academic
                </span>
                <span className="text-2xl font-bold tracking-tight text-blue-300 ml-1">
                  Feedback
                </span>
              </div>

            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-5">

              <Link
                to="/"
                className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                About
              </Link>

{/*               <Link
                to="/feedback"
                className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Feedback
              </Link>

              <Link
                to="/dashboard"
                className="hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Dashboard
              </Link> */}

              {/* Login */}
              <Link
                to="/sign-in"
                className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/sign-up"
                className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Register
              </Link>

            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">

            <div className="px-2 pt-2 pb-4 space-y-2 border-t border-indigo-700 mt-2">

              <Link
                to="/"
                className="block hover:bg-indigo-700 px-3 py-3 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/about"
                className="block hover:bg-indigo-700 px-3 py-3 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              <Link
                to="/feedback"
                className="block hover:bg-indigo-700 px-3 py-3 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Academic Feedback
              </Link>

              <Link
                to="/dashboard"
                className="block hover:bg-indigo-700 px-3 py-3 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/sign-in"
                className="block bg-indigo-600 hover:bg-indigo-500 px-3 py-3 rounded-md mt-4 text-center font-medium transition-colors duration-200 shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/sign-up"
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-3 py-3 rounded-md text-center font-medium transition-colors duration-200 shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Register
              </Link>

            </div>
          </div>
        )}

      </div>
    </nav>
  );
}