import { useLocation, Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  CreditCard, 
  BookOpen, 
  Store, 
  Settings, 
  BarChart, 
  LogOut, 
  Car
} from 'lucide-react';

interface SidebarProps {
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const [location] = useLocation();
  const { logout } = useAuth();

  // Helper to determine if link is active
  const isActive = (path: string) => location === path;

  // Get user initials for avatar
  const userInitials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-64 bg-gray-900 text-white shadow-xl transition-all duration-300 ease-in-out h-full">
      <div className="h-full flex flex-col">
        {/* Logo and Brand */}
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-orange-300" />
            <span className="text-xl font-bold">Amiran DS</span>
          </div>
        </div>
        
        {/* User Profile Summary */}
        <div className="flex items-center p-4 border-b border-gray-800">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
            <span className="text-white font-medium">{userInitials}</span>
          </div>
          <div>
            <div className="font-medium text-sm">{`${user.firstName} ${user.lastName}`}</div>
            <div className="text-xs text-gray-400">{user.role}</div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          <div className="space-y-1">
            <Link href="/admin/dashboard" className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/admin/dashboard') || isActive('/dashboard') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                <LayoutDashboard className="h-4 w-4 mr-3" />
                <span>Dashboard</span>
            </Link>
            <Link href="/admin/students" className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/admin/students') || isActive('/students') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                <GraduationCap className="h-4 w-4 mr-3" />
                <span>Students</span>
            </Link>
            <Link href="/admin/instructors" className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/admin/instructors') || isActive('/instructors') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                <Users className="h-4 w-4 mr-3" />
                <span>Instructors</span>
            </Link>
            <Link href="/admin/payments" className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/admin/payments') || isActive('/payments') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                <CreditCard className="h-4 w-4 mr-3" />
                <span>Payments</span>
            </Link>
            <Link href="/admin/courses" className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/admin/courses') || isActive('/courses') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                <BookOpen className="h-4 w-4 mr-3" />
                <span>Courses</span>
            </Link>
            <Link href="/admin/branches" className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/admin/branches') || isActive('/branches') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                <Store className="h-4 w-4 mr-3" />
                <span>Branches</span>
            </Link>
          </div>
          
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Administration
            </h3>
            <div className="mt-1 space-y-1">
              <Link href="/admin/settings" className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/admin/settings') || isActive('/settings') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                  <Settings className="h-4 w-4 mr-3" />
                  <span>Settings</span>
              </Link>
              <Link href="/admin/reports" className={`flex items-center px-3 py-2 text-sm rounded-md ${isActive('/admin/reports') || isActive('/reports') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                  <BarChart className="h-4 w-4 mr-3" />
                  <span>Reports</span>
              </Link>
            </div>
          </div>
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm rounded-md text-white bg-gray-800 hover:bg-gray-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
