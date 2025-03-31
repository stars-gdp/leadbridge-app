
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Clipboard, MessageCircle, CalendarDays, Settings } from "lucide-react";

const Layout = () => {
  const location = useLocation();

  const getNavLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex flex-col items-center justify-center ${
      isActive ? "text-blue-500" : "text-gray-500"
    } transition-colors`;
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50">
      <div className="flex-1 overflow-auto pb-16">
        <Outlet />
      </div>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
        <div className="flex justify-around h-16">
          <NavLink to="/" className={getNavLinkClass("/")}>
            <Clipboard className="h-6 w-6" />
            <span className="text-xs">Leads</span>
          </NavLink>
          
          <NavLink to="/chat" className={getNavLinkClass("/chat")}>
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs">Chat</span>
          </NavLink>
          
          <NavLink to="/tasks" className={getNavLinkClass("/tasks")}>
            <CalendarDays className="h-6 w-6" />
            <span className="text-xs">Tasks</span>
          </NavLink>
          
          <NavLink to="/settings" className={getNavLinkClass("/settings")}>
            <Settings className="h-6 w-6" />
            <span className="text-xs">Settings</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
