
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AppProvider, useApp } from '@/context/AppContext';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, CalendarPlus, Trash, Check } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { formatDate, formatTime } from '@/utils/dateUtils';
import GoogleCalendarConnect from '@/components/google-calendar/GoogleCalendarConnect';
import TeamMemberSchedule from '@/components/admin/TeamMemberSchedule';

const TeamMemberBookings = () => {
  const { memberId } = useParams();

  return (
    <AppProvider>
      <TeamMemberBookingsContent memberId={memberId || ''} />
    </AppProvider>
  );
};

const TeamMemberBookingsContent = ({ memberId }: { memberId: string }) => {
  const { teamMembers, bookings, cancelBooking } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const teamMember = teamMembers.find(m => m.id === memberId);
  const memberBookings = bookings.filter(b => b.memberId === memberId);
  
  const upcomingBookings = memberBookings.filter(b => {
    const bookingDateParts = b.timeSlot.date.split('-');
    const bookingDate = new Date(
      parseInt(bookingDateParts[0]),
      parseInt(bookingDateParts[1]) - 1,
      parseInt(bookingDateParts[2])
    );
    return bookingDate >= new Date() && b.status !== 'cancelled';
  });
  
  const pastBookings = memberBookings.filter(b => {
    const bookingDateParts = b.timeSlot.date.split('-');
    const bookingDate = new Date(
      parseInt(bookingDateParts[0]),
      parseInt(bookingDateParts[1]) - 1,
      parseInt(bookingDateParts[2])
    );
    return bookingDate < new Date() || b.status === 'cancelled';
  });

  const handleCancelBooking = async (bookingId: string) => {
    const success = await cancelBooking(bookingId);
    if (success) {
      toast.success('Booking cancelled successfully');
    } else {
      toast.error('Failed to cancel booking');
    }
  };
  
  if (!teamMember) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-8">
          <Container>
            <div className="p-6 bg-red-50 border border-red-200 rounded-md">
              <h3 className="text-red-800 font-medium mb-2">Team member not found</h3>
              <p className="text-red-600">
                The team member you're trying to manage does not exist.
              </p>
              <Link to="/admin" className="mt-4 inline-block">
                <Button variant="outline">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Admin
                </Button>
              </Link>
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
          <div className="mb-6">
            <Link to="/admin">
              <Button variant="outline" size="sm" className="mb-4">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Admin
              </Button>
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">{teamMember.name}'s Bookings</h1>
                <p className="text-gray-500">Manage bookings and schedule for this team member</p>
              </div>
              
              <div className="flex gap-2">
                <Link to={`/team/availability/${memberId}`}>
                  <Button variant="outline">
                    <CalendarPlus className="mr-1 h-4 w-4" />
                    Manage Availability
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Brand</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{booking.brandName}</div>
                                <div className="text-sm text-gray-500">Ticket: {booking.ticketId}</div>
                                {booking.googleEventId && (
                                  <div className="flex items-center text-xs text-merchantcare-600 mt-1">
                                    <Check className="h-3 w-3 mr-1" />
                                    Synced with Google
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {formatDate(new Date(booking.timeSlot.date))} at {formatTime(booking.timeSlot.startTime)}
                            </TableCell>
                            <TableCell>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                booking.status === 'scheduled' ? 'bg-merchantcare-100 text-merchantcare-800' : 
                                booking.status === 'rescheduled' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash className="mr-1 h-4 w-4" />
                                Cancel
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border rounded-md">
                      No upcoming bookings found
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border pointer-events-auto"
                    />
                  </CardContent>
                </Card>
                
                <GoogleCalendarConnect teamMemberId={memberId} />
                
                {selectedDate && (
                  <TeamMemberSchedule date={selectedDate} memberId={memberId} />
                )}
              </div>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Past Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {pastBookings.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Brand</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.brandName}</div>
                              <div className="text-sm text-gray-500">Ticket: {booking.ticketId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(new Date(booking.timeSlot.date))} at {formatTime(booking.timeSlot.startTime)}
                          </TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {booking.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500 border rounded-md">
                    No past bookings found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default TeamMemberBookings;
