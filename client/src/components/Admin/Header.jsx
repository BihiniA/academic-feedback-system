import React from "react";
import {
  Bell,
  Search,
  Menu,
  User,
  Brain,
} from "lucide-react";

const Header = ({ onMenuClick, username = "Academic Staff" }) => {
  return (
    <header className="bg-white shadow-sm z-10">

      <div className="flex items-center justify-between px-4 py-3">

        {/* Left Section */}

        <div className="flex items-center">

          <button
            onClick={onMenuClick}
            className="p-1 mr-4 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Menu size={24} className="text-indigo-700" />
          </button>

          <div className="flex items-center gap-2">

            <Brain
              size={24}
              className="text-indigo-600"
            />

            <h1 className="text-xl font-semibold text-gray-800">
              Academic Feedback Dashboard
            </h1>

          </div>

        </div>


        {/* Right Section */}

        <div className="flex items-center space-x-2 md:space-x-4">

          {/* Search */}

          <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1">

            <Search
              size={18}
              className="text-gray-500"
            />

            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none px-2 text-sm"
            />

          </div>


          {/* Notification */}

          <button className="p-1 rounded-full hover:bg-gray-100 relative">

            <Bell
              size={20}
              className="text-gray-600"
            />

            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>

          </button>


          {/* User */}

          <div className="flex items-center">

            <div className="flex items-center space-x-2">

              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white">

                <User size={16} />

              </div>

              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {username}
              </span>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;