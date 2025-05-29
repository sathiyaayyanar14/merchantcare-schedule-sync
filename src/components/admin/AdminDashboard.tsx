import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/context/AppContext';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { bookings, teamMembers, getUpcomingBookings, getPastBookings } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  
  // Use selected date or current date as reference
  const referenceDate = selectedDate || new Date();
  
  // Get all bookings for statistics
  const allUpcomingBookings = getUpcomingBookings(referenceDate);
  const allPastBookings = getPastBookings(referenceDate);
  
  // Show limited bookings for display (3-5 max)
  const displayUpcomingBookings = allUpcomingBookings.slice(0, 5);
  const displayPastBookings = allPastBookings.slice(0, 5);
  
  const generateReport = () => {
    toast.success('Weekly report generated and exported to Google Sheets');
  };
  
  const handleBookCall = () => {
    navigate('/?tab=schedule');
  };
  
  const getMemberName = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Unknown Member';
  };
  
  // Enhanced stats calculations
  const totalUpcoming = allUpcomingBookings.length;
  const totalCompleted = allPastBookings.filter(b => b.status === 'completed').length;
  const totalCancelled = allPastBookings.filter(b => b.status === 'cancelled').length;
  const totalRescheduled = bookings.filter(b => b.status === 'rescheduled').length;
  
  // Member stats
  const memberBookingCounts = teamMembers.map(member => {
    const count = bookings.filter(b => b.memberId === member.id).length;
    return { member, count };
  }).sort((a, b) => b.count - a.count);

  // Handle stat card clicks - navigate to bookings list with status filter
  const handleStatClick = (status: string) => {
    navigate(`/admin/bookings?status=${status}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Manage team calendar and bookings</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleBookCall}
            className="bg-merchantcare-600 hover:bg-merchantcare-700"
          >
            <CalendarPlus className="mr-1 h-4 w-4" />
            Book a Call
          </Button>
          <Button 
            onClick={generateReport}
            variant="outline"
          >
            Export Weekly Report
          </Button>
        </div>
      </div>
      
      {selectedDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-blue-800 text-sm">
            Showing bookings from <strong>{formatDate(referenceDate)}</strong> onwards
          </p>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatClick('upcoming')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Upcoming Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUpcoming}</div>
            <p className="text-xs text-gray-500 mt-1">Click to view all</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatClick('completed')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Completed Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}</div>
            <p className="text-xs text-gray-500 mt-1">Click to view all</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatClick('cancelled')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Cancelled Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCancelled}</div>
            <p className="text-xs text-gray-500 mt-1">Click to view all</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleStatClick('rescheduled')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Rescheduled Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRescheduled}</div>
            <p className="text-xs text-gray-500 mt-1">Click to view all</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Team Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming ({displayUpcomingBookings.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({displayPastBookings.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {displayUpcomingBookings.length > 0 ? (
                    displayUpcomingBookings.map(booking => (
                      <div 
                        key={booking.id} 
                        className="event-card upcoming border rounded-md p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/admin/booking/${booking.id}`)}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium">{booking.brandName}</h3>
                          <span className="text-sm bg-merchantcare-100 text-merchantcare-800 px-2 py-0.5 rounded">
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Ticket: {booking.ticketId}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(new Date(booking.timeSlot.date))} at {formatTime(booking.timeSlot.startTime)}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          Assigned to: {getMemberName(booking.memberId)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 border rounded-md">
                      No upcoming bookings found from {formatDate(referenceDate)}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {displayPastBookings.length > 0 ? (
                    displayPastBookings.map(booking => (
                      <div 
                        key={booking.id} 
                        className={`event-card border rounded-md p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                          booking.status === 'completed' ? 'bg-green-50' : 
                          booking.status === 'cancelled' ? 'bg-gray-50' : 'bg-blue-50'
                        }`}
                        onClick={() => navigate(`/admin/booking/${booking.id}`)}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium">{booking.brandName}</h3>
                          <span className={`text-sm px-2 py-0.5 rounded ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Ticket: {booking.ticketId}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(new Date(booking.timeSlot.date))} at {formatTime(booking.timeSlot.startTime)}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          Assigned to: {getMemberName(booking.memberId)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 border rounded-md">
                      No past bookings found before {formatDate(referenceDate)}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Select Reference Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border pointer-events-auto"
              />
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Team Workload</h3>
              
              <div className="space-y-2">
                {memberBookingCounts.map(({ member, count }) => (
                  <div key={member.id} className="flex items-center">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span>{member.name}</span>
                        <span className="font-medium">{count} bookings</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-merchantcare-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
