
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, signOut, loading } = useAuth();

  const handleBookCallClick = () => {
    const searchParams = new URLSearchParams(location.search);
    const currentTab = searchParams.get('tab');
    
    if (location.pathname === '/' && currentTab === 'schedule') {
      // If we're already on the schedule tab, scroll to the calendar
      const calendarElement = document.querySelector('[data-testid="calendar-view"]') || 
                             document.querySelector('.calendar-view') ||
                             document.querySelector('[class*="calendar"]');
      if (calendarElement) {
        calendarElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (location.pathname === '/') {
      // If we're on the home page but not on schedule tab, activate it
      const tabsTrigger = document.querySelector('[data-value="schedule"]') as HTMLElement;
      if (tabsTrigger) {
        tabsTrigger.click();
      }
    } else {
      // If we're on another page, navigate to home with schedule tab
      navigate('/?tab=schedule');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-blue-700 font-bold text-xl mr-2">
            <span className="text-orange-500">Gokwik</span>
            <span className="text-blue-700"> Merchant Care</span>
          </div>
          {!isMobile && (
            <span className="text-gray-500 text-sm ml-2">Scheduling Platform</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!loading && (
            <>
              {user ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin')}
                    size="sm"
                    className="hidden md:flex"
                  >
                    Admin Dashboard
                  </Button>
                  <Button
                    onClick={handleBookCallClick}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Book a Call
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        {user.email}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleBookCallClick}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Book a Call
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    size="sm"
                  >
                    Login
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
