import React from "react";
import {
  ClipboardCheck,
  Users,
  Brain,
  MessageSquareText,
} from "lucide-react";

const stats = [
  {
    icon: <ClipboardCheck size={40} />,
    value: "1,000+",
    label: "Assignments Reviewed",
  },
  {
    icon: <Users size={40} />,
    value: "500+",
    label: "Students Supported",
  },
  {
    icon: <Brain size={40} />,
    value: "95%",
    label: "AI Feedback Accuracy",
    highlight: true,
  },
  {
    icon: <MessageSquareText size={40} />,
    value: "2,500+",
    label: "Feedback Generated",
  },
];

const StatsSection = () => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-8 bg-gradient-to-r from-indigo-900 via-purple-800 to-blue-800 p-12 shadow-xl">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`flex flex-col items-center text-white p-8 rounded-xl transition-all duration-300 transform hover:scale-105 min-w-[220px] ${
            stat.highlight
              ? "bg-purple-950 shadow-lg border-2 border-purple-300 scale-110"
              : "bg-indigo-800/80 hover:bg-indigo-950"
          }`}
        >
          {/* Icon */}
          <div
            className={`mb-4 p-4 rounded-full ${
              stat.highlight
                ? "bg-purple-800 text-purple-200"
                : "bg-indigo-900 text-blue-200"
            }`}
          >
            {stat.icon}
          </div>

          {/* Value */}
          <h3 className="text-4xl font-bold mb-2">
            {stat.value}
          </h3>

          {/* Label */}
          <p className="text-lg text-blue-100 text-center">
            {stat.label}
          </p>

          {/* Decorative line */}
          <div className="mt-3 h-1 w-16 bg-blue-300 rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;