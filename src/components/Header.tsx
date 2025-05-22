
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
            onClick={() => navigate('/')}
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
