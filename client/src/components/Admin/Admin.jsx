import React, { useState, useEffect } from "react";
import {
  Brain,
  BookOpen,
  ClipboardCheck,
  MessageSquareText,
  UserCircle,
} from "lucide-react";

const AcademicDashboardWelcome = ({ username = "Academic Staff" }) => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  const tabs = [
    {
      name: "Dashboard",
      icon: Brain,
    },
    {
      name: "Modules",
      icon: BookOpen,
    },
    {
      name: "Assignments",
      icon: ClipboardCheck,
    },
    {
      name: "Feedback History",
      icon: MessageSquareText,
    },
    {
      name: "Profile",
      icon: UserCircle,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-purple-100 shadow-lg p-8 mb-8 min-h-96">

      {/* Decorative elements */}

      <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-200 rounded-full opacity-30"></div>

      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-200 rounded-full opacity-30"></div>

      <div className="absolute top-24 right-24 w-20 h-20 bg-blue-200 rounded-full opacity-40"></div>


      {/* Content container */}

      <div className="relative z-10 flex flex-col justify-between h-full">

        {/* Welcome header */}

        <div className="flex items-center mb-8">

          <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center text-white mr-4 shadow-md">
            <Brain className="h-8 w-8" />
          </div>

          <div>

            <h1 className="text-3xl font-bold text-indigo-800">
              {greeting},{" "}
              <span className="text-indigo-600">
                {username}
              </span>
              !
            </h1>

            <p className="text-lg text-indigo-700">
              Welcome to your AI Academic Feedback Dashboard
            </p>

          </div>

        </div>


        {/* Description card */}

        <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm rounded-lg p-6 border border-indigo-100 mb-8 max-w-3xl">

          <h2 className="text-xl font-semibold text-indigo-800 mb-3">
            Smarter Academic Feedback with AI
          </h2>

          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Manage your academic modules, review assignments, and provide
            intelligent feedback using AI-powered academic analysis.
          </p>

          <p className="text-gray-700 leading-relaxed text-lg">
            Use the dashboard to manage your modules, monitor assignments,
            review feedback history, and maintain your academic profile
            from one centralized platform.
          </p>

        </div>


        {/* Bottom section */}

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">

          {/* Quote */}

          <div className="italic text-indigo-700 text-lg font-serif max-w-md">
            "Technology can enhance education by making feedback more
            meaningful, timely, and personalized."
          </div>


          {/* Five Navigation Tabs */}

          <div className="flex flex-wrap gap-3">

            {tabs.map((tab) => {

              const Icon = tab.icon;

              return (
                <div
                  key={tab.name}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-indigo-100 shadow-sm text-indigo-700 hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
                >

                  <Icon className="h-5 w-5" />

                  <span className="text-sm font-medium whitespace-nowrap">
                    {tab.name}
                  </span>

                </div>
              );

            })}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AcademicDashboardWelcome;