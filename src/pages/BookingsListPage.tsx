
import React from 'react';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingsList from '@/components/admin/BookingsList';

const BookingsListPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <Container>
          <BookingsList />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default BookingsListPage;
