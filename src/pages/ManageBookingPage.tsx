
import React from 'react';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ManageBooking from '@/components/booking/ManageBooking';

const ManageBookingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <Container>
          <ManageBooking />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default ManageBookingPage;
