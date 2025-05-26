
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { useApp } from '@/context/AppContext';
import { Check } from 'lucide-react';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const { bookings, teamMembers } = useApp();
  const navigate = useNavigate();
  
  // Find booking by ID from the bookings array
  const booking = bookings.find(b => b.id === bookingId);
  
  console.log('Looking for booking with ID:', bookingId);
  console.log('Available bookings:', bookings);
  console.log('Found booking:', booking);
  
  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Booking Not Found</h3>
              <p className="text-gray-500 mb-4">We couldn't find the booking you're looking for.</p>
              <Button onClick={() => navigate('/')}>
                Return to Scheduling Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const teamMember = teamMembers.find(m => m.id === booking.memberId);

  const handleManageBooking = () => {
    navigate(`/manage/${booking.id}`);
  };

  const handleNewBooking = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          <CardDescription>Your meeting has been scheduled successfully.</CardDescription>
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
          
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Booking Information</h3>
            <p className="text-gray-700">
              <span className="font-medium">Brand Name:</span> {booking.brandName}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Ticket ID:</span> {booking.ticketId}
            </p>
            {booking.description && (
              <div className="mt-2">
                <p className="font-medium">Description:</p>
                <p className="text-gray-700">{booking.description}</p>
              </div>
            )}
          </div>
          
          {booking.additionalGuests.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Additional Guests</h3>
              <ul className="list-disc pl-5">
                {booking.additionalGuests.map((guest, index) => (
                  <li key={index} className="text-gray-700">{guest}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-medium text-blue-800 mb-1">Next Steps</h3>
            <p className="text-blue-700 text-sm">
              A calendar invitation has been sent to your email. You can manage your booking using the link below.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={handleManageBooking} className="w-full sm:w-auto">
            Manage This Booking
          </Button>
          <Button onClick={handleNewBooking} className="w-full sm:w-auto bg-merchantcare-600 hover:bg-merchantcare-700">
            Schedule Another Meeting
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
