import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Brain,
  MapPin,
  Phone,
  Clock,
  GraduationCap,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-indigo-950 text-white relative">
      {/* Decorative top border with AI pattern */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-indigo-800 flex justify-around items-center overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <Brain
            key={i}
            className="h-3 w-3 text-blue-400 transform rotate-12"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">

        {/* Logo and mission statement */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-indigo-800 rounded-lg mr-3">
              <Brain className="h-8 w-8 text-blue-300" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight">
              AI Academic Feedback
            </h2>
          </div>

          <p className="text-blue-200 max-w-2xl text-lg">
            Empowering students and educators with intelligent, personalized,
            and meaningful academic feedback through artificial intelligence.
          </p>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* About Us */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-indigo-700 pb-2">
              About Us
            </h3>

            <p className="text-gray-300 leading-relaxed">
              AI Academic Feedback System helps students understand their
              academic performance through AI-powered analysis, personalized
              feedback, and recommendations for continuous improvement.
            </p>

            <div className="mt-6">
              <a
                href="/about"
                className="inline-flex items-center text-blue-300 hover:text-white transition"
              >
                Learn more about our system
                <span className="ml-2">→</span>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-indigo-700 pb-2">
              Resources
            </h3>

            <ul className="space-y-4">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white flex items-center transition"
                >
                  <span className="mr-2">→</span>
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-white flex items-center transition"
                >
                  <span className="mr-2">→</span>
                  About
                </a>
              </li>

              <li>
                <a
                  href="/feedback"
                  className="text-gray-300 hover:text-white flex items-center transition"
                >
                  <span className="mr-2">→</span>
                  Academic Feedback
                </a>
              </li>

              <li>
                <a
                  href="/dashboard"
                  className="text-gray-300 hover:text-white flex items-center transition"
                >
                  <span className="mr-2">→</span>
                  Student Dashboard
                </a>
              </li>

              <li>
                <a
                  href="/sign-in"
                  className="text-gray-300 hover:text-white flex items-center transition"
                >
                  <span className="mr-2">→</span>
                  Sign In
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-indigo-700 pb-2">
              Contact
            </h3>

            <ul className="space-y-4">

              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-300 mr-3 mt-1" />

                <span className="text-gray-300">
                  Academic Support Centre
                  <br />
                  Sri Lanka
                </span>
              </li>

              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-300 mr-3" />

                <span className="text-gray-300">
                  +94 11 234 5678
                </span>
              </li>

              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-300 mr-3" />

                <span className="text-gray-300">
                  support@aifeedback.com
                </span>
              </li>

              <li className="flex items-center">
                <Clock className="h-5 w-5 text-blue-300 mr-3" />

                <span className="text-gray-300">
                  Mon-Fri: 8:30 AM - 5:00 PM
                </span>
              </li>

            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="text-xl font-semibold mb-6 border-b border-indigo-700 pb-2">
              Connect With Us
            </h3>

            <p className="text-gray-300 mb-4">
              Stay connected with our academic technology community and
              discover new ways to improve learning with AI.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">

              <a
                href="#"
                className="flex items-center justify-center bg-indigo-800 hover:bg-indigo-700 p-3 rounded-lg text-white transition duration-300"
              >
                <Facebook className="h-6 w-6 mr-2" />
                <span>Facebook</span>
              </a>

              <a
                href="#"
                className="flex items-center justify-center bg-indigo-800 hover:bg-indigo-700 p-3 rounded-lg text-white transition duration-300"
              >
                <Twitter className="h-6 w-6 mr-2" />
                <span>Twitter</span>
              </a>

              <a
                href="#"
                className="flex items-center justify-center bg-indigo-800 hover:bg-indigo-700 p-3 rounded-lg text-white transition duration-300"
              >
                <Instagram className="h-6 w-6 mr-2" />
                <span>Instagram</span>
              </a>

              <a
                href="#"
                className="flex items-center justify-center bg-indigo-800 hover:bg-indigo-700 p-3 rounded-lg text-white transition duration-300"
              >
                <Mail className="h-6 w-6 mr-2" />
                <span>Newsletter</span>
              </a>

            </div>

            <div>
              <a
                href="/contact"
                className="block bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-center py-3 rounded-lg font-medium transition duration-300 shadow-lg"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>

        {/* Academic feature strip */}
        <div className="mt-12 p-5 rounded-xl bg-indigo-900/50 border border-indigo-700/50 flex flex-col md:flex-row items-center justify-center gap-3 text-center">
          <GraduationCap className="h-6 w-6 text-blue-300" />

          <p className="text-gray-300 text-sm">
            AI-powered insights designed to support better learning,
            continuous improvement, and academic success.
          </p>
        </div>

        {/* Copyright and additional links */}
        <div className="mt-10 pt-6 border-t border-indigo-800 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">

          <p>
            &copy; {new Date().getFullYear()} AI Academic Feedback System.
            All rights reserved.
          </p>

          <div className="flex space-x-6 mt-4 md:mt-0">

            <a
              href="/privacy"
              className="hover:text-white transition"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="hover:text-white transition"
            >
              Terms of Service
            </a>

            <a
              href="/sitemap"
              className="hover:text-white transition"
            >
              Sitemap
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}