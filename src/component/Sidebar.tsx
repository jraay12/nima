import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  CalendarDays,
  Users,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    group: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
      { label: "Events", icon: CalendarDays, to: "/event" },
      { label: "Members", icon: Users, to: "/member" },
    ],
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(
    window.innerWidth < 768, // mobile by default
  );

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/administrator/login");
  };
  return (
    <aside
      className={`relative flex flex-col bg-[#014d1a] transition-all duration-300 ease-in-out ${
        collapsed ? "w-[68px]" : "w-[230px]"
      } h-screen shrink-0`}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.055) 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3.5 top-[72px] z-20 w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm
          flex items-center justify-center text-gray-500 hover:text-[#027027] hover:border-[#027027]/30
          transition-all duration-200 active:scale-95"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Logo */}
      <div
        className={`relative z-10 flex items-center gap-3 px-4 py-5 border-b border-white/10 ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <BadgeCheck className="w-4.5 h-4.5 text-white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-[15px] tracking-wide leading-none">
              NIMANV
            </p>
            <p className="text-white/40 text-[10px] mt-0.5 font-medium tracking-widest uppercase">
              Admin
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 py-5 overflow-y-auto overflow-x-hidden">
        {navItems.map((group) => (
          <div key={group.group} className="mb-5">
            {!collapsed && (
              <p className="px-4 mb-1.5 text-[10px] font-bold text-white/30 uppercase tracking-[0.16em]">
                {group.group}
              </p>
            )}
            {collapsed && <div className="mx-auto w-6 h-px bg-white/10 mb-2" />}
            <ul className="space-y-0.5">
              {group.items.map(({ label, icon: Icon, to }) => (
                <li key={label}>
                  <NavLink
                    to={to}
                    end={to === "/admin"}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-150 relative
                      ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "text-white/55 hover:text-white hover:bg-white/8"
                      }
                      ${collapsed ? "justify-center px-0 mx-2" : ""}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#5dca9a] rounded-r-full" />
                        )}
                        <Icon
                          className={`shrink-0 transition-colors ${
                            isActive
                              ? "text-[#5dca9a]"
                              : "text-white/45 group-hover:text-white/70"
                          } ${collapsed ? "w-5 h-5" : "w-4 h-4"}`}
                          strokeWidth={isActive ? 2.2 : 1.8}
                        />
                        {!collapsed && <span>{label}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User / Logout */}
      <div className="relative z-10 border-t border-white/10 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/8 transition-colors group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-[#027027] border border-white/20 flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-bold">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">
                Admin User
              </p>
              <p className="text-white/40 text-[10px] truncate">
                info@nimanv.com
              </p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="text-white/30 hover:text-white/70 transition-colors"
              aria-label="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleLogout()}
            className="w-full flex items-center justify-center py-2 text-white/30 hover:text-white/70 transition-colors"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
