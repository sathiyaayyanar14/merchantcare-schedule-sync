
import React from 'react';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminDashboard from '@/components/admin/AdminDashboard';
import TeamMembersList from '@/components/admin/TeamMembersList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppProvider } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <Container>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Admin Portal</h1>
                  <p className="text-gray-500">Manage team schedule and bookings</p>
                </div>
                <Link to="/team/availability">
                  <Button variant="outline">
                    Manage Your Availability
                  </Button>
                </Link>
              </div>
              
              <Tabs defaultValue="dashboard">
                <TabsList className="mb-6">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard">
                  <AdminDashboard />
                </TabsContent>
                
                <TabsContent value="team">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold">Team Management</h1>
                      <p className="text-gray-500">Manage your team members and their availability</p>
                    </div>
                    <TeamMembersList />
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

export default Admin;
