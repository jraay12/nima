import { Outlet } from "react-router";
import Sidebar from "../component/Sidebar";

const AdministratorLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f7f9f7]">
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-[60px] bg-white border-b border-gray-100 flex items-center justify-end md:justify-between px-6 shrink-0">
          <div className="hidden md:block">
            <h1 className="text-sm font-semibold text-gray-800">
              Nevada Iranian-American Medical Association
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Administrator Portal
            </p>
          </div>
          <div className="flex items-center gap-3 ">
            <div className="w-2 h-2 rounded-full bg-[#027027] animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">Live</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdministratorLayout;