
import React from 'react';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AvailabilityManager from '@/components/availability/AvailabilityManager';
import { AppProvider } from '@/context/AppContext';

const TeamAvailability = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <Container>
            <div>
              <h1 className="text-2xl font-bold mb-2">Manage Your Availability</h1>
              <p className="text-gray-500 mb-6">Set your working hours and blocked times</p>
              <AvailabilityManager />
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default TeamAvailability;
