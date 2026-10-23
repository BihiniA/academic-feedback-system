import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardEdit,
  History,
  UserCircle,
  LogOut,
  Brain,
} from "lucide-react";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      title: "Dashboard",
      path: "/lecturer",
    },
    {
      icon: <PlusCircle size={20} />,
      title: "Create New Feedback",
      path: "/admin/feedback/create-feedback",
    },
   /*  {
      icon: <ClipboardEdit size={20} />,
      title: "Edit & Review Feedback",
      path: "/lecturer/edit-review-feedback",
    }, */
    {
      icon: <History size={20} />,
      title: "Feedback History",
      path: "/history",
    },
    {
      icon: <UserCircle size={20} />,
      title: "Profile",
      path: "/lecturer/profile",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col`}
    >
      {/* Logo / Brand */}
      <div className="flex items-center justify-center h-16 border-b">

        {isOpen ? (
          <div className="flex items-center gap-2">
            <Brain
              size={24}
              className="text-indigo-600"
            />

            <h2 className="text-lg font-bold text-indigo-600">
              AI Academic
            </h2>
          </div>
        ) : (
          <Brain
            size={26}
            className="text-indigo-600"
          />
        )}

      </div>

      {/* Navigation */}
      <nav className="flex-1 pt-4 pb-4 overflow-y-auto">

        <ul>

          {menuItems.map((item, index) => {

            const isActive =
              location.pathname === item.path;

            return (
              <li key={index}>

                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center px-4 py-3 w-full text-left transition-colors ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50 border-r-4 border-indigo-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >

                  <span className="inline-flex items-center justify-center h-6 w-6">
                    {item.icon}
                  </span>

                  {isOpen && (
                    <span className="ml-3">
                      {item.title}
                    </span>
                  )}

                </button>

              </li>
            );

          })}

        </ul>

      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4">

        <button
          onClick={() => navigate("/logout")}
          className="flex items-center text-red-500 hover:bg-red-50 p-2 rounded-md w-full transition-colors"
        >

          <LogOut size={20} />

          {isOpen && (
            <span className="ml-3">
              Logout
            </span>
          )}

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;