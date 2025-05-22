
import React from 'react';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalendarView from '@/components/calendar/CalendarView';
import BookingForm from '@/components/booking/BookingForm';
import { AppProvider } from '@/context/AppContext';

const Index = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <Container>
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">Schedule a Call with MerchantCare</h1>
              <p className="text-gray-600 mb-8">
                Select an available time slot that works best for you and our team will be ready to assist.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <CalendarView />
                </div>
                <div className="md:mt-14">
                  <BookingForm />
                </div>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default Index;
