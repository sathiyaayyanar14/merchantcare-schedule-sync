
import React from 'react';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AvailabilityManager from '@/components/availability/AvailabilityManager';
import { AppProvider, useApp } from '@/context/AppContext';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import GoogleCalendarConnect from '@/components/google-calendar/GoogleCalendarConnect';

const TeamAvailability = () => {
  const { memberId } = useParams();
  
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <Container>
            <div className="mb-6">
              <Link to="/admin">
                <Button variant="outline" size="sm" className="mb-4">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Admin
                </Button>
              </Link>
              
              <h1 className="text-2xl font-bold mb-2">
                {memberId ? "Manage Team Member's Availability" : "Manage Your Availability"}
              </h1>
              <p className="text-gray-500 mb-6">
                {memberId ? "Set working hours and blocked times for this team member" : "Set your working hours and blocked times"}
              </p>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <AvailabilityManager teamMemberId={memberId} />
                </div>
                <div>
                  <GoogleCalendarConnect teamMemberId={memberId} />
                  <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">How Google Calendar Integration Works</h3>
                    <ul className="text-sm text-blue-600 space-y-2 list-disc pl-4">
                      <li>Connect your Google Calendar to automatically sync bookings</li>
                      <li>When a booking is made, it's added to your Google Calendar</li>
                      <li>If you cancel a booking in Google Calendar, it will be cancelled here too</li>
                      <li>Updates to bookings are reflected in both systems</li>
                    </ul>
                  </div>
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

export default TeamAvailability;
