import { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { Menu, Bell, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Use user data from context, or fallback to defaults
  const userData = {
    firstName: user?.firstName || 'Admin',
    lastName: user?.lastName || 'User',
    role: user?.role || 'admin'
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={toggleSidebar}
          ></div>
          <div className="fixed inset-y-0 left-0 z-40 w-64">
            <Sidebar user={userData} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar user={userData} />
      </div>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-100">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center md:hidden">
              <button 
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
                <HelpCircle className="h-5 w-5" />
              </button>
              <div className="border-l border-gray-300 h-6 mx-2"></div>
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{`${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
