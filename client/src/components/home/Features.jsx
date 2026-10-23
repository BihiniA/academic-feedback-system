
import {
  Code2,
  BrainCircuit,
  ClipboardCheck
} from "lucide-react";

export default function Services() {
  return (
    <div className="py-24 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-transparent opacity-70"></div>

      <div className="absolute -left-16 top-1/4 w-32 h-32 rounded-full bg-blue-100 opacity-30"></div>

      <div className="absolute -right-16 bottom-1/4 w-48 h-48 rounded-full bg-blue-100 opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Section heading */}
        <div className="flex items-center justify-center mb-16">

          <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-300"></div>

          <h2 className="text-4xl font-bold text-center mx-4 text-[#0B2545] relative">
            Our Features

            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-600 rounded-full"></span>
          </h2>

          <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-300"></div>

        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-12">

          {/* Feature 1 */}
          <div className="group relative bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-blue-50">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 to-blue-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

            <div className="inline-flex items-center justify-center p-5 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors duration-300">

              <Code2 className="h-10 w-10 text-blue-700 group-hover:text-blue-900 transition-colors duration-300" />

            </div>

            <h3 className="text-2xl font-semibold mb-3 text-[#0B2545]">
              Programming Assignment Analysis
            </h3>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Analyze student programming answers against assignment
              questions and marking criteria to identify coding errors,
              logical weaknesses, strengths, and missing requirements.
            </p>

          </div>

          {/* Feature 2 */}
          <div className="group relative bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-blue-50">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-300 to-blue-800 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

            <div className="inline-flex items-center justify-center p-5 bg-indigo-100 rounded-full mb-6 group-hover:bg-indigo-200 transition-colors duration-300">

              <BrainCircuit className="h-10 w-10 text-indigo-700 group-hover:text-indigo-900 transition-colors duration-300" />

            </div>

            <h3 className="text-2xl font-semibold mb-3 text-[#0B2545]">
              AI-Assisted Personalized Feedback
            </h3>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Generate structured, personalized feedback with
              explanations and improvement suggestions to support
              student understanding and learning progress.
            </p>

          </div>

          {/* Feature 3 */}
          <div className="group relative bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-blue-50">

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-300 to-blue-700 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

            <div className="inline-flex items-center justify-center p-5 bg-sky-100 rounded-full mb-6 group-hover:bg-sky-200 transition-colors duration-300">

              <ClipboardCheck className="h-10 w-10 text-sky-700 group-hover:text-sky-900 transition-colors duration-300" />

            </div>

            <h3 className="text-2xl font-semibold mb-3 text-[#0B2545]">
              Lecturer Review & Approval
            </h3>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Review, edit, and approve AI-generated feedback before
              sharing it with students, keeping lecturers in control
              of the academic evaluation process.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}