import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ className }) => {
  const navigationItems = [
    { label: "Contacts", icon: "Users", path: "/" },
    { label: "Deals", icon: "DollarSign", path: "/deals" },
    { label: "Companies", icon: "Building2", path: "/companies" },
    { label: "Analytics", icon: "BarChart3", path: "/analytics" }
  ];

  return (
    <aside className={cn("w-64 bg-white shadow-lg flex-shrink-0", className)}>
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <ApperIcon name="Zap" className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">FlowCRM</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200",
                  isActive && "gradient-primary text-white hover:text-white shadow-lg"
                )
              }
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;