
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleBookCallClick = () => {
    if (location.pathname === '/') {
      // If we're on the home page, scroll to the Schedule tab and activate it
      const tabsTrigger = document.querySelector('[data-value="schedule"]') as HTMLElement;
      if (tabsTrigger) {
        tabsTrigger.click();
      }
    } else {
      // If we're on another page, navigate to home with schedule tab
      navigate('/?tab=schedule');
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-merchantcare-700 font-bold text-xl mr-2">
            <span className="text-merchantcare-500">Merchant</span>
            Care
          </div>
          {!isMobile && (
            <span className="text-gray-500 text-sm ml-2">Scheduling Platform</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
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
            className="bg-merchantcare-600 hover:bg-merchantcare-700"
          >
            Book a Call
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
