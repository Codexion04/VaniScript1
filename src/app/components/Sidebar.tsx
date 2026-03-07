import { Home, Calendar, TrendingUp, Sparkles, LogOut, Search, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";

interface SidebarProps {
  activeView: "home" | "scheduler" | "virality" | "posts" | "discovery";
  onNavigate: (view: "home" | "scheduler" | "virality" | "posts" | "discovery") => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  activeView,
  onNavigate,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("");

  const navItems = [
    { id: "home" as const, icon: Home, label: "Home" },
    { id: "discovery" as const, icon: Search, label: "Discovery Hub" },
    { id: "posts" as const, icon: Sparkles, label: "My Posts" },
    { id: "scheduler" as const, icon: Calendar, label: "Time Scheduler" },
    { id: "virality" as const, icon: TrendingUp, label: "Virality Prediction" },
  ];

  // ✅ Load User Attributes Properly
  useEffect(() => {
    const loadUser = async () => {
      try {
        const attributes = await fetchUserAttributes();

        const name = attributes.name || "User";
        const email = attributes.email || "";

        setUserName(name);
        setUserEmail(email);

        const initials = name.substring(0, 2).toUpperCase();
        setUserInitials(initials);

      } catch (error) {
        console.log("Error fetching user attributes:", error);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await signOut();
    onLogout();
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50 backdrop-blur-xl relative flex flex-col h-full"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden lg:block">
              <h2 className="font-bold text-white">Vaniscript</h2>
              <p className="text-xs text-gray-400">AI Manager</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            title={isCollapsed ? item.label : ""}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id
              ? "bg-[#2563EB] text-white shadow-lg shadow-blue-500/30"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="hidden lg:block whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-700/50 space-y-2">
        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700/50 transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white font-medium">
            {userInitials}
          </div>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden lg:block flex-1 overflow-hidden">
              <p className="text-xs font-medium text-white truncate">
                {userName || "User"}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {userEmail}
              </p>
            </motion.div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          title={isCollapsed ? "Logout" : ""}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-900/10 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="hidden lg:block">Logout</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="w-full mt-2 flex items-center justify-center p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </motion.aside>
  );
}