
import React from 'react';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AvailabilityManager from '@/components/availability/AvailabilityManager';
import { AppProvider } from '@/context/AppContext';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

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
              <AvailabilityManager teamMemberId={memberId} />
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default TeamAvailability;
