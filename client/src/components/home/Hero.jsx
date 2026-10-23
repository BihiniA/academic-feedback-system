import { ArrowRight, Brain, Sparkles } from 'lucide-react';
import HeroImage from '../../assets/Home/main.jpg';

export default function Hero() {
  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Background image with overlay and animation */}
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105 hover:scale-100 transition-transform duration-10000"
        style={{
          backgroundImage: `url(${HeroImage})`,
          animation: 'subtle-zoom 20s infinite alternate'
        }}
      />

      {/* AI Academic themed overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/80 via-purple-900/60 to-blue-900/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-700/10 to-blue-500/10" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-indigo-900/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-indigo-950/40 to-transparent" />

      {/* Side borders */}
      <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-indigo-900/20 to-transparent" />
      <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-blue-900/20 to-transparent" />

      {/* Animated AI particles */}
      <div className="absolute w-2 h-2 bg-blue-300/40 rounded-full top-1/4 left-1/4 animate-pulse" />
      <div className="absolute w-3 h-3 bg-purple-300/30 rounded-full top-3/4 left-1/3 animate-ping" />
      <div className="absolute w-2 h-2 bg-indigo-200/40 rounded-full top-1/2 right-1/4 animate-bounce" />
      <div className="absolute w-4 h-4 bg-blue-200/20 rounded-full top-1/3 right-1/3 animate-pulse" />
      <div className="absolute w-2 h-2 bg-purple-400/30 rounded-full bottom-1/4 right-1/4 animate-ping" />

      {/* AI decorative icons */}
      <div className="absolute top-20 right-20 opacity-20 animate-pulse">
        <Brain className="w-16 h-16 text-blue-200" />
      </div>

      <div className="absolute bottom-20 right-40 opacity-20 animate-bounce">
        <Sparkles className="w-12 h-12 text-purple-200" />
      </div>

      {/* Content container */}
      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="text-white transform hover:translate-x-2 transition-transform duration-500 backdrop-blur-sm bg-slate-950/20 p-6 md:p-8 rounded-xl border border-blue-300/20 shadow-2xl max-w-4xl">

          {/* Small label */}
          <div className="flex items-center gap-2 mb-4 text-blue-200">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              AI-Powered Academic Support
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-5 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200 drop-shadow-md">
            Smarter Academic Feedback
            <br />
            <span className="text-blue-200">
              Powered by AI
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl mb-7 max-w-2xl text-slate-100 drop-shadow-lg leading-relaxed">
            Get personalized, intelligent feedback on your academic work.
            Identify strengths, discover areas for improvement, and enhance
            your learning with AI-driven academic guidance.
          </p>

          {/* CTA Button */}
          <button className="group bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 px-7 py-3.5 rounded-lg flex items-center transform transition-all duration-300 hover:translate-x-1 hover:shadow-lg hover:shadow-blue-600/30 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-indigo-900/30">
            <span className="mr-2 font-medium">
              Get Academic Feedback
            </span>

            <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes subtle-zoom {
          0% {
            transform: scale(1.05);
          }

          100% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}