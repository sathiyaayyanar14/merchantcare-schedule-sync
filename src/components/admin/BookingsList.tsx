
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/utils/dateUtils';

const BookingsList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'all';
  const { bookings, teamMembers } = useApp();

  const getFilteredBookings = () => {
    switch (status) {
      case 'upcoming':
        return bookings.filter(booking => {
          const bookingDateTime = new Date(`${booking.timeSlot.date}T${booking.timeSlot.startTime}`);
          return bookingDateTime >= new Date() && booking.status !== 'cancelled';
        });
      case 'completed':
        return bookings.filter(b => b.status === 'completed');
      case 'cancelled':
        return bookings.filter(b => b.status === 'cancelled');
      case 'rescheduled':
        return bookings.filter(b => b.status === 'rescheduled');
      default:
        return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();
  
  const getMemberName = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Unknown Member';
  };

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

  const getStatusTitle = () => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming Bookings';
      case 'completed':
        return 'Completed Meetings';
      case 'cancelled':
        return 'Cancelled Meetings';
      case 'rescheduled':
        return 'Rescheduled Meetings';
      default:
        return 'All Bookings';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{getStatusTitle()}</h1>
        <p className="text-gray-500">
          {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <div className="grid gap-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map(booking => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.brandName}</CardTitle>
                    <p className="text-sm text-gray-500">Ticket ID: {booking.ticketId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/booking/${booking.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {formatDate(new Date(booking.timeSlot.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Time:</span> {formatTime(booking.timeSlot.startTime)} - {formatTime(booking.timeSlot.endTime)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Team Member:</span> {getMemberName(booking.memberId)}
                    </p>
                  </div>
                  <div>
                    {booking.description && (
                      <p className="text-sm">
                        <span className="font-medium">Description:</span> {booking.description}
                      </p>
                    )}
                    {booking.additionalGuests.length > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Guests:</span> {booking.additionalGuests.length}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No Bookings Found</h3>
                <p className="text-gray-500 mb-4">
                  No bookings match the selected criteria.
                </p>
                <Button onClick={() => navigate('/admin')}>
                  Return to Admin Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingsList;
