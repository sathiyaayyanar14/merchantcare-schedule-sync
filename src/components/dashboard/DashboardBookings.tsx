
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DashboardBookings = () => {
  const { bookings, teamMembers } = useApp();
  
  // Get current date for comparison
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Filter upcoming bookings (future bookings that are not cancelled)
  const upcomingBookings = bookings.filter(booking => {
    const bookingDateParts = booking.timeSlot.date.split('-');
    const bookingTimeParts = booking.timeSlot.startTime.split(':');
    
    const bookingDateTime = new Date(
      parseInt(bookingDateParts[0]),
      parseInt(bookingDateParts[1]) - 1,
      parseInt(bookingDateParts[2]),
      parseInt(bookingTimeParts[0]),
      parseInt(bookingTimeParts[1])
    );
    
    return bookingDateTime >= now && booking.status !== 'cancelled';
  });
  
  // Filter past bookings - show last 5 completed/cancelled calls from all team members
  const pastBookings = bookings
    .filter(booking => {
      const bookingDateParts = booking.timeSlot.date.split('-');
      const bookingTimeParts = booking.timeSlot.startTime.split(':');
      
      const bookingDateTime = new Date(
        parseInt(bookingDateParts[0]),
        parseInt(bookingDateParts[1]) - 1,
        parseInt(bookingDateParts[2]),
        parseInt(bookingTimeParts[0]),
        parseInt(bookingTimeParts[1])
      );
      
      return bookingDateTime < now || booking.status === 'cancelled' || booking.status === 'completed';
    })
    .sort((a, b) => {
      // Sort by date and time, most recent first
      const dateA = new Date(`${a.timeSlot.date}T${a.timeSlot.startTime}`);
      const dateB = new Date(`${b.timeSlot.date}T${b.timeSlot.startTime}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5); // Show only last 5
  
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
      default:
        return 'outline';
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="upcoming" className="flex-1">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1">
              Recent Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingBookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.brandName}</TableCell>
                      <TableCell>{booking.ticketId}</TableCell>
                      <TableCell>
                        {formatDate(new Date(booking.timeSlot.date))} at {formatTime(booking.timeSlot.startTime)}
                      </TableCell>
                      <TableCell>{getMemberName(booking.memberId)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No upcoming bookings found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastBookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.brandName}</TableCell>
                      <TableCell>{booking.ticketId}</TableCell>
                      <TableCell>
                        {formatDate(new Date(booking.timeSlot.date))} at {formatTime(booking.timeSlot.startTime)}
                      </TableCell>
                      <TableCell>{getMemberName(booking.memberId)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No past bookings found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardBookings;
