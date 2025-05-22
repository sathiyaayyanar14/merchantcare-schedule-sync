
import React from 'react';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingConfirmation from '@/components/booking/BookingConfirmation';
import { AppProvider } from '@/context/AppContext';

const Confirmation = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <Container>
            <BookingConfirmation />
          </Container>
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default Confirmation;
