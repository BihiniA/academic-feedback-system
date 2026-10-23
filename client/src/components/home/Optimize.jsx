import React from "react";
import { Brain, Sparkles, ArrowRight } from "lucide-react";
import AcademicHero from "../../assets/Home/main.jpg";

const AcademicHeroSection = () => {
  return (
    <div className="relative w-full h-96 overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${AcademicHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* AI Academic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/85 via-purple-900/70 to-blue-900/60"></div>

        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Decorative AI Elements */}
      <div className="absolute top-10 left-10 opacity-20 animate-pulse">
        <Brain className="w-16 h-16 text-blue-200" />
      </div>

      <div className="absolute bottom-10 right-16 opacity-20 animate-bounce">
        <Sparkles className="w-12 h-12 text-purple-200" />
      </div>

      <div className="absolute top-20 right-1/4 w-3 h-3 bg-blue-300/40 rounded-full animate-ping"></div>

      <div className="absolute bottom-24 left-1/4 w-2 h-2 bg-purple-300/40 rounded-full animate-pulse"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">

        {/* Small Label */}
        <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <Sparkles className="w-4 h-4 text-blue-200" />

          <span className="text-sm font-medium text-blue-100">
            AI-Powered Academic Support
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="mb-4 text-4xl font-bold md:text-5xl tracking-tight">
          Improve Your Academic Performance
          <span className="block text-blue-200 mt-1">
            with Intelligent AI Feedback
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mb-8 text-sm md:text-base text-gray-100 leading-relaxed">
          Receive personalized feedback on your academic work, identify your
          strengths and weaknesses, and discover practical recommendations
          to support continuous learning and academic improvement.
        </p>

        {/* Button */}
        <button className="group flex items-center px-6 py-3 font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:scale-105">

          <span className="mr-2">
            Get Started
          </span>

          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />

        </button>

      </div>
    </div>
  );
};

export default AcademicHeroSection;