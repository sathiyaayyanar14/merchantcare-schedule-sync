
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AppProvider, useApp } from '@/context/AppContext';
import { useParams } from 'react-router-dom';
import CalendarView from '@/components/calendar/CalendarView';
import BookingForm from '@/components/booking/BookingForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TeamMemberBooking = () => {
  const { memberId } = useParams();

  return (
    <AppProvider>
      <TeamMemberBookingContent memberId={memberId || ''} />
    </AppProvider>
  );
};

const TeamMemberBookingContent = ({ memberId }: { memberId: string }) => {
  const { teamMembers } = useApp();
  
  const teamMember = teamMembers.find(m => m.id === memberId);
  
  if (!teamMember) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <Container>
            <div className="p-6 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-red-800 font-medium mb-2">Team member not found</h3>
              <p className="text-red-600">
                The team member you're trying to book with does not exist or is no longer available.
              </p>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <Container>
          <div className="max-w-7xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={teamMember.avatar} alt={teamMember.name} />
                    <AvatarFallback>{teamMember.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">Book a Call with {teamMember.name}</CardTitle>
                    <p className="text-gray-600 mt-1">
                      Schedule your MerchantCare consultation with {teamMember.name}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <CalendarView memberId={memberId} />
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
  );
};

export default TeamMemberBooking;
