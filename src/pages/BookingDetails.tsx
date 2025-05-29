
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { useApp } from '@/context/AppContext';
import { ArrowLeft } from 'lucide-react';

const BookingDetails = () => {
  const { bookingId } = useParams();
  const { bookings, teamMembers } = useApp();
  const navigate = useNavigate();
  
  const booking = bookings.find(b => b.id === bookingId);
  
  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <Container>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">Booking Not Found</h3>
                  <p className="text-gray-500 mb-4">We couldn't find the booking you're looking for.</p>
                  <Button onClick={() => navigate('/admin')}>
                    Return to Admin Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  const teamMember = teamMembers.find(m => m.id === booking.memberId);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'rescheduled':
        return 'secondary';
      case 'scheduled':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-8">
        <Container>
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-gray-500">View and manage booking information</p>
          </div>

          <Card className="max-w-2xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{booking.brandName}</CardTitle>
                  <CardDescription>Ticket ID: {booking.ticketId}</CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Meeting Details</h3>
                <p className="text-gray-700">
                  <span className="font-medium">Date:</span> {formatDate(new Date(booking.timeSlot.date), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Time:</span> {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                </p>
                {teamMember && (
                  <p className="text-gray-700">
                    <span className="font-medium">Team Member:</span> {teamMember.name}
                  </p>
                )}
              </div>
              
              {booking.description && (
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{booking.description}</p>
                </div>
              )}
              
              {booking.additionalGuests.length > 0 && (
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Additional Guests</h3>
                  <ul className="list-disc pl-5">
                    {booking.additionalGuests.map((guest, index) => (
                      <li key={index} className="text-gray-700">{guest}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div>
                <h3 className="font-medium mb-2">Booking Metadata</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Created:</span> {formatDate(new Date(booking.createdAt))} at {formatTime(new Date(booking.createdAt).toTimeString().slice(0, 5))}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Last Updated:</span> {formatDate(new Date(booking.updatedAt))} at {formatTime(new Date(booking.updatedAt).toTimeString().slice(0, 5))}
                </p>
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default BookingDetails;
