
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-4 bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">
            <p className="text-sm text-gray-500">
              © {currentYear} MerchantCare Scheduling. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-merchantcare-600 hover:underline">Privacy Policy</a>
            <a href="#" className="text-sm text-merchantcare-600 hover:underline">Terms of Service</a>
            <a href="#" className="text-sm text-merchantcare-600 hover:underline">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
