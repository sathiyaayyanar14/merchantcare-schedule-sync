
import React from 'react';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CalendarView from '@/components/calendar/CalendarView';
import BookingForm from '@/components/booking/BookingForm';
import { AppProvider } from '@/context/AppContext';
import DashboardBookings from '@/components/dashboard/DashboardBookings';
import TeamAvailabilityOverview from '@/components/dashboard/TeamAvailabilityOverview';
import ApplyTimeSlots from '@/components/calendar/ApplyTimeSlots';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <Container>
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">MerchantCare Scheduling Dashboard</h1>
              <p className="text-gray-600 mb-8">
                View upcoming calls, team availability, and schedule new appointments.
              </p>
              
              <Tabs defaultValue="dashboard" className="mb-8">
                <TabsList className="mb-4 w-full sm:w-auto">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule a Call</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DashboardBookings />
                    <div className="space-y-6">
                      <TeamAvailabilityOverview />
                      <ApplyTimeSlots />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="schedule">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <CalendarView />
                    </div>
                    <div className="md:mt-14">
                      <BookingForm />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default Index;
