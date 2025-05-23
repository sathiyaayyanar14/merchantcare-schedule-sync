
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DashboardBookings = () => {
  const { getUpcomingBookings, getPastBookings, teamMembers } = useApp();
  
  const upcomingBookings = getUpcomingBookings();
  const pastBookings = getPastBookings();
  
  const getMemberName = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Unknown Member';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="upcoming" className="flex-1">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex-1">
              Past ({pastBookings.length})
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
                        <Badge variant="outline">{booking.status}</Badge>
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
                        <Badge 
                          variant={booking.status === 'completed' ? 'default' : 
                                 booking.status === 'cancelled' ? 'destructive' : 'outline'}
                        >
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
