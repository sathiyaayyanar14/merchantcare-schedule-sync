
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatTime } from '@/utils/dateUtils';
import { useApp } from '@/context/AppContext';

const TeamMemberSchedule = ({ date, memberId }: { date: Date, memberId: string }) => {
  const { timeSlots, bookings } = useApp();
  
  // Get all time slots for this member on this date
  const dateString = date.toISOString().split('T')[0];
  const memberSlots = timeSlots.filter(slot => 
    slot.date === dateString && slot.memberId === memberId
  );
  
  // Get bookings for these slots
  const slotBookings = bookings.filter(booking => 
    booking.timeSlot.date === dateString && 
    booking.memberId === memberId &&
    booking.status !== 'cancelled'
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Daily Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {memberSlots.length === 0 ? (
          <p className="text-gray-500 text-sm">No time slots assigned for this day.</p>
        ) : (
          <div className="grid gap-2">
            {memberSlots.map(slot => {
              const booking = slotBookings.find(b => b.timeSlot.id === slot.id);
              return (
                <div 
                  key={slot.id} 
                  className={`p-2 rounded-md border ${
                    booking ? 'bg-merchantcare-50 border-merchantcare-200' : 
                    slot.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </div>
                    <Badge className={`text-xs ${
                      booking ? 'bg-merchantcare-500' : 
                      slot.available ? 'bg-green-500' : 'bg-gray-500'
                    }`}>
                      {booking ? 'Booked' : (slot.available ? 'Available' : 'Unavailable')}
                    </Badge>
                  </div>
                  
                  {booking && (
                    <div className="mt-1 text-xs text-gray-600">
                      <div>{booking.brandName}</div>
                      <div>Ticket: {booking.ticketId}</div>
                      {booking.googleEventId && (
                        <div className="text-xs text-merchantcare-600 mt-1">
                          ↗ Synced with Google Calendar
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMemberSchedule;
